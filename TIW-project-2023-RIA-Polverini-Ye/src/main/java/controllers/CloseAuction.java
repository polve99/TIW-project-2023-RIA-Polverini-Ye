package controllers;

import beans.Article;
import beans.Auction;
import beans.Bid;
import beans.User;
import dao.ArticleDAO;
import dao.AuctionDAO;
import dao.BidDAO;

import utilis.ConnectionHandler;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;

@WebServlet("/CloseAuction")
public class CloseAuction extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Connection connection = null;

    public CloseAuction() {
        super();
        // TODO Auto-generated constructor stub
    }

    @Override
    public void init() throws ServletException {
        connection = ConnectionHandler.getConnection(getServletContext());
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);

        User user = (User) session.getAttribute("user");
        String userMail = user.getUserMail();

        String closeMsg = null;

        BidDAO bidDAO = new BidDAO(connection);
        AuctionDAO auctionDAO = new AuctionDAO(connection);
        ArticleDAO articleDAO = new ArticleDAO(connection);
        Bid maxBid = null;
        ArrayList<Article> articles = null;

        int idAuction = (int) session.getAttribute("idAuction");

        Auction auction = null;
        try {
            auction = auctionDAO.findAuctionByIdAuction(idAuction);
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Not possible to recover auction in database");
            return;
        }

        if (auction == null) {
        	response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Auction not found");
            return;
        }

        Timestamp now = new Timestamp(System.currentTimeMillis());

        if(!auction.getUserMail().equals(userMail)) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("You are not the owner of this auction");
            return;
        } else if (auction.getExpirationDateTime().after(now)){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Auction not expired yet. Check Time Left.");
            return;
        } else if (!auction.isOpen()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Auction already closed");
            return;
        }

            try {
                auctionDAO.closeAuction(idAuction);
                maxBid = bidDAO.findMaxBidInAuction(idAuction);

                if(maxBid==null){
                    articles = articleDAO.findArticlesListByIdAuction(idAuction);
                    auctionDAO.putBackArticles(idAuction);
                    closeMsg = "Auction closed successfully. It had No bids so all articles will be put back: ";
                    for (Article article : articles) {
                        closeMsg += " " + article.getArticleName();
                    }
                    closeMsg += ".";
                } else {
                    closeMsg = "Auction closed successfully.";
                }
            } catch (SQLException e) {
                e.printStackTrace();
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Not possible to close auction in database");
                return;
            }

        Gson gson = new Gson();
        String articlesString = gson.toJson(articles);
        
        System.out.println("fino a qua tutto ok");
        if (maxBid == null) {
            String finalObject1 = "{\"articles\": " + articlesString + ",\n" + "\"bidValue\": " + "\"no one\"" + ",\n" + "\"idAuction\": " + idAuction + ",\n" + "\"closeMsg\": " +"\""+closeMsg+"\""+"\n}";
        	response.setStatus(HttpServletResponse.SC_OK);
        	response.getWriter().print(finalObject1);
        } else {
            String finalObject1 = "{\"articles\": " + articlesString + ",\n" + "\"bidValue\": " + maxBid.getBidValue() + ",\n" + "\"idAuction\": " + idAuction + ",\n" + "\"closeMsg\": " +"\""+closeMsg+"\""+"\n}";
        	response.setStatus(HttpServletResponse.SC_OK);
        	response.getWriter().print(finalObject1);
        }

    }
}