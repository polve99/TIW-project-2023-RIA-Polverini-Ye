package controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import beans.Article;
import beans.Auction;
import beans.Bid;
import beans.User;
import dao.ArticleDAO;
import dao.AuctionDAO;
import dao.BidDAO;

import com.google.gson.Gson;

import utilis.ConnectionHandler;

@WebServlet("/GoToAuction")
@MultipartConfig
public class GoToAuction extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Connection connection = null;
    private AuctionDAO auctionDAO;
    private ArticleDAO articleDAO;
    private BidDAO bidDAO;

    public GoToAuction() {
        super();
    }

    @Override
    public void init() throws ServletException {
        connection = ConnectionHandler.getConnection(getServletContext());
        
        auctionDAO = new AuctionDAO(connection);
        articleDAO = new ArticleDAO(connection);
        bidDAO = new BidDAO(connection);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);

        User user = (User) session.getAttribute("user");

        String idAuctionParam = request.getParameter("idAuction");
        request.setAttribute("idAuction", idAuctionParam);
        if (idAuctionParam == null || idAuctionParam.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Invalid auction ID");
            return;
        }

        int idAuction;
        
        try {
            idAuction = Integer.parseInt(idAuctionParam);
            if(!auctionDAO.isAuctionInDB(idAuction)){
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().println("idAuction in request not found.");
                return;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        Auction auction;
        boolean isAuctionNotExpired = false;
        List<Article> articles;
        Bid maxBid;
        float initialPrice;
        List<Bid> bids;
        List<Object> closedAuctionInfo = null;

        try {
            auction = auctionDAO.findAuctionByIdAuction(idAuction);
            isAuctionNotExpired = auctionDAO.isAuctionNotExpired(idAuction);
            articles = articleDAO.findArticlesListByIdAuction(idAuction);
            maxBid = bidDAO.findMaxBidInAuction(idAuction); // rimuovere e prenderlo da bids
            initialPrice = auction.getInitialPrice();
            bids = bidDAO.findBidsListByIdAuction(idAuction);
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal db error in retrieving auction details");
            return;
        }
        
        if(!isAuctionNotExpired){
            try{
                closedAuctionInfo = auctionDAO.getAuctionClosedInfos(auction);
            } catch (SQLException e) {
                e.printStackTrace();
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal db error in retrieving closed auction info");
                return;
            }
        }

        // Salva l'ID dell'asta nella sessione
        session.setAttribute("idAuction", idAuction);

        HashMap<String, Object> templateVariables = new HashMap<>();
        templateVariables.put("user", user);
        templateVariables.put("auction", auction);
        templateVariables.put("articles", articles);
        templateVariables.put("maxBid", maxBid);
        templateVariables.put("initialPrice", initialPrice);
        templateVariables.put("bids", bids);
        templateVariables.put("timeLeftFormatted", formatTimeLeft(auction.getExpirationDateTime()));
        templateVariables.put("isOpen", auction.isOpen());
        templateVariables.put("isNotExpired", isAuctionNotExpired);
        if(closedAuctionInfo != null) templateVariables.put("closedAuctionInfo", closedAuctionInfo);
        
        if(auction.getUserMail().equals(user.getUserMail())) {
            templateVariables.put("owner", Boolean.TRUE);
        } else {
        	templateVariables.put("owner", Boolean.FALSE);
        }

        Gson gson = new Gson();
        String templateVariablesString = gson.toJson(templateVariables);
        
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().println(templateVariablesString);
    }
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Chiamiamo il metodo doGet per gestire la logica comune alle richieste GET e POST
        doGet(request, response);
    }

    @Override
    public void destroy() {
        ConnectionHandler.closeConnection(connection);
    }

    private String formatTimeLeft(Timestamp expirationDateTime) {
        long timeLeftMillis = expirationDateTime.getTime() - System.currentTimeMillis();
        
        if(timeLeftMillis<0) {
        	String msg = "expired";
        	return msg;
        }

        long seconds = timeLeftMillis / 1000;
        long days = seconds / (24 * 60 * 60);
        seconds %= (24 * 60 * 60);
        long hours = seconds / (60 * 60);
        seconds %= (60 * 60);
        long minutes = seconds / 60;
        seconds %= 60;

        return String.format("%d days, %02d:%02d:%02d", days, hours, minutes, seconds);
    }
}
