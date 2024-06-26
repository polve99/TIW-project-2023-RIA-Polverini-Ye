package dao;

import beans.Article;

import java.io.File;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class ArticleDAO {

    private Connection connection;

    public ArticleDAO(Connection connection) {
        this.connection = connection;
    }

    public boolean createArticle(String articleName, String articleDescription, float articlePrice, String image, String userMail) throws SQLException{
        String query = "INSERT INTO dbaste.articles (articleName, articleDescription, image, articlePrice, userMail) VALUES (?, ?, ?, ?, ?)";
        PreparedStatement pStatement = null;

        try{
            pStatement = connection.prepareStatement(query);
            pStatement.setString(1, articleName);
            pStatement.setString(2, articleDescription);
            pStatement.setString(3, image);
            pStatement.setFloat(4, articlePrice);
            pStatement.setString(5, userMail);
            pStatement.executeUpdate();
        } catch (SQLException e){
            throw new SQLException(e);
        } finally {
            try{
                if(pStatement != null){
                    pStatement.close();
                }
            } catch (Exception e2){
                throw new SQLException(e2);
            }
        }
        return true;
    }

    public boolean deleteArticle(int articleCode) throws SQLException {
        String query = "DELETE FROM dbaste.articles WHERE articleCode = ?";
        PreparedStatement pStatement = null;

        try {
            pStatement = connection.prepareStatement(query);
            pStatement.setInt(1, articleCode);
            pStatement.executeUpdate();
        } catch (SQLException e) {
            throw new SQLException(e);
        } finally {
            try {
                if (pStatement != null) {
                    pStatement.close();
                }
            } catch (Exception e2) {
                throw new SQLException(e2);
            }
        }
        return true;
    }

    public boolean updateArticle(Article article) throws SQLException {
        String query = "UPDATE dbaste.articles SET articleName = ?, articleDescription = ?, image = ?, articlePrice = ?, idAuction = ?, userMail = ? WHERE articleCode = ?";
        PreparedStatement pStatement = null;

        try {
            pStatement = connection.prepareStatement(query);
            pStatement.setString(1, article.getArticleName());
            pStatement.setString(2, article.getArticleDescription());
            pStatement.setString(3, article.getImage());
            pStatement.setFloat(4, article.getArticlePrice());
            pStatement.setInt(5, article.getIdAuction());
            pStatement.setInt(6, article.getArticleCode());
            pStatement.setString(7, article.getUserMail());
            pStatement.executeUpdate();
        } catch (SQLException e) {
            throw new SQLException(e);
        } finally {
            try {
                if (pStatement != null) {
                    pStatement.close();
                }
            } catch (Exception e2) {
                throw new SQLException(e2);
            }
        }
        return true;
    }

    public Article findArticleByArticleCode(int articleCode) throws SQLException {
        Article article = null;
        String query = "SELECT * FROM dbaste.articles WHERE articleCode = ?";
        ResultSet resultSet = null;
        PreparedStatement pStatement = null;

        try {
            pStatement = connection.prepareStatement(query);
            pStatement.setInt(1, articleCode);
            resultSet = pStatement.executeQuery();

            if (resultSet.next()) {
                article = new Article();
                article.setArticleCode(resultSet.getInt("articleCode"));
                article.setArticleName(resultSet.getString("articleName"));
                article.setArticleDescription(resultSet.getString("articleDescription"));
                article.setImage(resultSet.getString("image"));
                article.setArticlePrice(resultSet.getFloat("articlePrice"));
                article.setIdAuction(resultSet.getInt("idAuction"));
                article.setUserMail(resultSet.getString("userMail"));
            }
        } catch (SQLException e) {
            throw new SQLException(e);
        } finally {
            try {
                if (resultSet != null) {
                    resultSet.close();
                }
            } catch (Exception e1) {
                throw new SQLException(e1);
            }
            try {
                if (pStatement != null) {
                    pStatement.close();
                }
            } catch (Exception e2) {
                throw new SQLException(e2);
            }
        }
        return article;
    }

    public ArrayList<Article> findArticlesListByIdAuction(int idAuction) throws SQLException {
        ArrayList<Article> articles = new ArrayList<Article>();
        String query = "SELECT * FROM dbaste.articles WHERE idAuction = ?";
        ResultSet resultSet = null;
        PreparedStatement pStatement = null;

        try {
            pStatement = connection.prepareStatement(query);
            pStatement.setInt(1, idAuction);
            resultSet = pStatement.executeQuery();

            while (resultSet.next()) {
                Article article = new Article();
                article.setArticleCode(resultSet.getInt("articleCode"));
                article.setArticleName(resultSet.getString("articleName"));
                article.setArticleDescription(resultSet.getString("articleDescription"));
                article.setImage(resultSet.getString("image"));
                article.setArticlePrice(resultSet.getFloat("articlePrice"));
                article.setIdAuction(resultSet.getInt("idAuction"));
                article.setUserMail(resultSet.getString("userMail"));
                articles.add(article);
            }
        } catch (SQLException e) {
            throw new SQLException(e);
        } finally {
            try {
                if (resultSet != null) {
                    resultSet.close();
                }
            } catch (Exception e1) {
                throw new SQLException(e1);
            }
            try {
                if (pStatement != null) {
                    pStatement.close();
                }
            } catch (Exception e2) {
                throw new SQLException(e2);
            }
        }
        return articles;
    }
    
    public ArrayList<Article> findImagesByUser (String userMail) throws SQLException {
    	ArrayList<Article> images = new ArrayList<Article>();
    	String query = "SELECT * FROM dbaste.articles WHERE userMail = ? AND idAuction IS NULL";
    	 ResultSet resultSet = null;
         PreparedStatement pStatement = null;
         try {
             pStatement = connection.prepareStatement(query);
             pStatement.setString(1, userMail);
             resultSet = pStatement.executeQuery();

             while (resultSet.next()) {
                 images.add(new Article(resultSet.getInt("articleCode"),resultSet.getString("articleName"),resultSet.getString("articleDescription"),resultSet.getString("image"),resultSet.getFloat("articlePrice"), resultSet.getString("userMail")));
             }
         } catch (SQLException e) {
             throw new SQLException(e);
         } finally {
             try {
                 if (resultSet != null) {
                     resultSet.close();
                 }
             } catch (Exception e1) {
                 throw new SQLException(e1);
             }
             try {
                 if (pStatement != null) {
                     pStatement.close();
                 }
             } catch (Exception e2) {
                 throw new SQLException(e2);
             }
         }
         return images;
    }
    
    public Article findArticleByImage(String image) throws SQLException {
    	String query = "SELECT * FROM dbaste.articles WHERE image = ?";
    	Article article = null;
    	ResultSet resultSet = null;
        PreparedStatement pStatement = null;
        try {
            pStatement = connection.prepareStatement(query);
            pStatement.setString(1, image);
            resultSet = pStatement.executeQuery();
            
            //System.out.println(resultSet.getInt("articleCode"));
            //TODO: sistemare e capire perchè si blocca qua
            if(!resultSet.next()) return null;
            int articleCode = resultSet.getInt("articleCode");
            String articleName = resultSet.getString("articleName");
            String articleDesc = resultSet.getString("articleDescription");
            String img = resultSet.getString("image");
            float artPrice = resultSet.getFloat("articlePrice");
            String userMail = resultSet.getString("userMail");
            
            article = new Article(articleCode,articleName,articleDesc,img,artPrice,userMail);
            
        } catch (SQLException e) {
            throw new SQLException(e);
        } finally {
            try {
                if (resultSet != null) {
                    resultSet.close();
                }
            } catch (Exception e1) {
                throw new SQLException(e1);
            }
            try {
                if (pStatement != null) {
                    pStatement.close();
                }
            } catch (Exception e2) {
                throw new SQLException(e2);
            }
        }
        return article;
    }

}

