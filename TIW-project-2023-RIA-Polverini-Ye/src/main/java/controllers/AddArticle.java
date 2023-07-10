package controllers;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.regex.Pattern;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.annotation.WebServlet;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.Part;

import org.apache.commons.lang.StringEscapeUtils;

import com.google.gson.Gson;

import dao.ArticleDAO;
import beans.Article;
import beans.User;
import utilis.ConnectionHandler;

@WebServlet("/AddArticle")
@MultipartConfig
public class AddArticle extends HttpServlet{
	
	private static final long serialVersionUID = 1L;
    private Connection connection = null;

    public AddArticle() {
        super();
    }

    @Override
    public void init() throws ServletException {
        ServletContext servletContext = getServletContext();
        connection = ConnectionHandler.getConnection(servletContext);
    }
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		//String shortDir = "/images";
		String userHome = System.getProperty("user.home");
        String pathString = userHome + "/git/TIW-project-2023-RIA-Polverini-Ye/TIW-project-2023-RIA-Polverini-Ye/src/main/webapp/images";
        String pathString1 = userHome + "/git/TIW-project-2023-pure-HTML-Polverini-Ye/TIW-project-2023-pure-HTML-Polverini-Ye";
        Path path = Paths.get(pathString);
        Path path1 = Paths.get(pathString1);
		//System.out.println("Webapp path: " + webappPath);

		String uploadDirectory = path.toString();
		String uploadDirectory1 = path1.toString();
	    //String filePath = null;
	    //String shortFilePath = null;
	    String fileName = null;
	    //System.out.println(uploadDirectory);
	    
	    Article articlesObject = null;
	    
	    // crea nuova directory se non esiste
	    File dir = new File(uploadDirectory);
	    if (!dir.exists()) {
	        dir.mkdirs();
	    }
	    
	    File dir1 = new File(uploadDirectory1);
	    if (!dir1.exists()) {
	        dir1.mkdirs();
	    }

	    try {
	        Part filePart = request.getPart("articleImage"); // riceve la image part dalla richiesta
	        if(filePart == null) {
	        	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	            response.getWriter().println("no file uploaded");
	            return;
	        }
	        fileName = System.currentTimeMillis() + "_" + filePart.getSubmittedFileName(); // estrae il nome
	        String fileExtension = getFileExtension(fileName);

	        // Check if the file extension is allowed
	        if (isAllowedExtension(fileExtension)) {
	            //filePath = uploadDirectory + File.separator + fileName;
	            //shortFilePath = shortDir+ File.separator + fileName;
	            //response.getWriter().println(filePath);

	            // salvataggio del file nella cartella images
	            
	            //response.getWriter().println(uploadDirectory);
	            try (InputStream inputStream = filePart.getInputStream()) {
	                File file = new File(uploadDirectory, fileName);
	                File file1 = new File(uploadDirectory1, fileName);
	                Files.copy(inputStream, file.toPath(), StandardCopyOption.REPLACE_EXISTING);
	                Files.copy(inputStream, file1.toPath(), StandardCopyOption.REPLACE_EXISTING);
	            }
	            
	            //response.getWriter().println("File uploaded successfully!");
	            
	        } else {
	        	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	            response.getWriter().println("Invalid file type. Only JPG, JPEG, PNG, and GIF files are allowed.");
	            return;
	        }
	    } catch (Exception ex) {
	    	ex.printStackTrace();
	    	response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
	        response.getWriter().println("Error uploading file: " + ex.getMessage());
            return;
	    }
	
	    float price = 0;
	    String articleName =  StringEscapeUtils.escapeJava(request.getParameter("articleName"));
	    String articleDesc = StringEscapeUtils.escapeJava(request.getParameter("articleDesc"));
	    String articlePrice = StringEscapeUtils.escapeJava(request.getParameter("articlePrice"));
	    
	    if(!isNumber(articlePrice)) {
	    	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("article price has wrong format");
            return;
	    }
	    
	    User user = (User) request.getSession().getAttribute("user");
	    
	    if(articleName==null ||articleName.length()<1 || articleName.length()>20) {
	    	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Article name must be at least 1 and max 20");
            return;
	    } else if(articleDesc!=null && articleDesc.length()>255){
	    	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Article description must be at max 255");
            return;
	    } else if (articlePrice != null && !articlePrice.isEmpty()) {
	        try {
	            price = Float.parseFloat(articlePrice);
	            if(price<0) {
	            	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
		            response.getWriter().println("price must be greater or equal to zero");
		            return;
	            }
	        } catch (NumberFormatException e) {
	        	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	            response.getWriter().println("Price in input is not a valid number");
	            return;
	        }
	    } else {
	    	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Price is null");
            return;
	    }
	    
	    ArticleDAO article = new ArticleDAO(connection);
	    //PER CONTROLLARE IN FUTURO IL PATH DOVE VENGONO SALVATE LE IMMAGINI, COMMENTARE DAL TRY FINO A DOPO LA SENDREDIRECT E DECOMMENTARE LE RESPONSE.GETWRITER()
	   try {
		   //Part filePart = request.getPart("articleImage"); 
	       //fileName = filePart.getSubmittedFileName(); 
	       String fileExtension = getFileExtension(fileName);
	       
	       if(isAllowedExtension(fileExtension)) {
	    	    connection.setAutoCommit(false);
	       		article.createArticle(articleName, articleDesc, price, fileName ,user.getUserMail());
	       		articlesObject = new Article(articleName, articleDesc, price, fileName, user.getUserMail());
	       		connection.commit();
	       } else {
	    	    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	            response.getWriter().println("Invalid file type. Only JPG, JPEG and PNG files are allowed.");
	            return;
	       }
		} catch (SQLException e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal server error, retry later");
			return;
		} finally {
            try {
                
                connection.setAutoCommit(true);
            } catch (SQLException e) {
                e.printStackTrace();
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error in committing transaction");
                return;
            }
        }
	   
	   Gson gson = new Gson();
	   String articlesObjectString = gson.toJson(articlesObject);
	   
	   response.setStatus(HttpServletResponse.SC_OK);
	   response.setContentType("application/json");
	   response.setCharacterEncoding("UTF-8");
	   response.getWriter().print(articlesObjectString);
	}

	// prende l'estensione del file
	private String getFileExtension(String fileName) {
	    int dotIndex = fileName.lastIndexOf(".");
	    if (dotIndex != -1 && dotIndex < fileName.length() - 1) {
	        return fileName.substring(dotIndex + 1);
	    }
	    return "";
	}

	// controlla che l'estensione vada bene
	private boolean isAllowedExtension(String fileExtension) {
	    String[] allowedExtensions = {"jpg", "jpeg", "png", "gif"};
	    for (String ext : allowedExtensions) {
	        if (ext.equalsIgnoreCase(fileExtension)) {
	            return true;
	        }
	    }
	    return false;
	}
    
    private boolean isNumber(String num) {
    	Pattern numberPattern = Pattern.compile("\\d+");
		if (num.length()>0) {
			return numberPattern.matcher(num).matches();
		} else {
			return false;
		}
    }
}