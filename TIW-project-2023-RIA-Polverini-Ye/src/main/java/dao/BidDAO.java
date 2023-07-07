package dao;

import beans.Bid;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;

public class BidDAO {

    public Connection connection;

    public BidDAO(Connection connection) {
        this.connection = connection;
    }

    public int createBid(float bidValue, String userMail, int idAuction, Timestamp bidDateTime) throws SQLException {
        String query = "INSERT INTO dbaste.bids (bidValue, bidDateTime, userMail, idAuction) VALUES (?,?,?,?)";
        PreparedStatement pstatement = null;
        ResultSet res = null;
        int idBid = 0;
        //Timestamp bidDateTime = new Timestamp(System.currentTimeMillis());
        try {
            pstatement = connection.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
            pstatement.setFloat(1, bidValue);
            pstatement.setTimestamp(2, bidDateTime);
            pstatement.setString(3, userMail);
            pstatement.setInt(4, idAuction);
            pstatement.executeUpdate();
            res = pstatement.getGeneratedKeys();
            if(res.next()) idBid = (int) res.getLong(1);
        } catch (SQLException e) {
            throw new SQLException(e);
        } finally {
            try {
                if (pstatement != null) {
                    pstatement.close();
                }
                if( res != null) {
                	res.close();
                }
            } catch (SQLException e) {
                throw new SQLException(e);
            }
        }
        return idBid;
    }

    public Bid findBidByIdBid(int idBid) throws SQLException{
        Bid bid = null;
        String query = "SELECT * FROM dbaste.bids WHERE idBid = ?";
        ResultSet resultSet = null;
        PreparedStatement pStatement = null;

        try{
            pStatement = connection.prepareStatement(query);
            pStatement.setInt(1, idBid);
            resultSet = pStatement.executeQuery();
            while (resultSet.next()) {
            	bid = new Bid();
                bid.setIdBid(resultSet.getInt("idBid"));
                bid.setBidValue(resultSet.getFloat("bidValue"));
                bid.setBidDateTime(resultSet.getTimestamp("bidDateTime"));
                bid.setUserMail(resultSet.getString("userMail"));
                bid.setIdAuction(resultSet.getInt("idAuction"));
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
        return bid;
    }

    public ArrayList<Bid> findBidsListByUserMail(String userMail) throws SQLException {
        ArrayList<Bid> bids = new ArrayList<Bid>();
        String query = "SELECT * FROM dbaste.bids WHERE userMail = ?";
        ResultSet resultSet = null;
        PreparedStatement pStatement = null;

        try{
            pStatement = connection.prepareStatement(query);
            pStatement.setString(1, userMail);
            resultSet = pStatement.executeQuery();
            while (resultSet.next()) {
                Bid bid = new Bid();
                bid.setIdBid(resultSet.getInt("idBid"));
                bid.setBidValue(resultSet.getFloat("bidValue"));
                bid.setBidDateTime(resultSet.getTimestamp("bidDateTime"));
                bid.setUserMail(resultSet.getString("userMail"));
                bid.setIdAuction(resultSet.getInt("idAuction"));
                bids.add(bid);
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
        return bids;
    }

    public ArrayList<Bid> findBidsListByIdAuction(int idAuction) throws SQLException{
        ArrayList<Bid> bids = new ArrayList<Bid>();
        String query = "SELECT * FROM dbaste.bids WHERE idAuction = ?";
        ResultSet resultSet = null;
        PreparedStatement pStatement = null;

        try{
            pStatement = connection.prepareStatement(query);
            pStatement.setInt(1, idAuction);
            resultSet = pStatement.executeQuery();
            while (resultSet.next()) {
                Bid bid = new Bid();
                bid.setIdBid(resultSet.getInt("idBid"));
                bid.setBidValue(resultSet.getFloat("bidValue"));
                bid.setBidDateTime(resultSet.getTimestamp("bidDateTime"));
                bid.setUserMail(resultSet.getString("userMail"));
                bid.setIdAuction(resultSet.getInt("idAuction"));
                bids.add(bid);
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
        return bids;
    }

    public Bid findMaxBidInAuction(int idAuction) throws SQLException {
        Bid bid = null;
        String query = "SELECT * FROM dbaste.bids WHERE idAuction = ? AND bidValue = (SELECT MAX(bidValue) FROM dbaste.bids WHERE idAuction = ?)";
        ResultSet resultSet = null;
        PreparedStatement pStatement = null;

        try {
            pStatement = connection.prepareStatement(query);
            pStatement.setInt(1, idAuction);
            pStatement.setInt(2, idAuction);
            resultSet = pStatement.executeQuery();
            if (resultSet.next()) {
            	bid = new Bid();
                bid.setIdBid(resultSet.getInt("idBid"));
                bid.setBidValue(resultSet.getFloat("bidValue"));
                bid.setBidDateTime(resultSet.getTimestamp("bidDateTime"));
                bid.setUserMail(resultSet.getString("userMail"));
                bid.setIdAuction(resultSet.getInt("idAuction"));
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
        return bid;
    }

    public ArrayList<Bid> getBidsListInDescOrder() throws SQLException {
        ArrayList<Bid> orderedBids = new ArrayList<Bid>();
        String query = "SELECT * FROM dbaste.bids ORDER BY bidValue DESC";
        ResultSet resultSet = null;
        PreparedStatement pStatement = null;

        try{
            pStatement = connection.prepareStatement(query);
            resultSet = pStatement.executeQuery();
            while (resultSet.next()) {
                Bid bid = new Bid();
                bid.setIdBid(resultSet.getInt("idBid"));
                bid.setBidValue(resultSet.getFloat("bidValue"));
                bid.setBidDateTime(resultSet.getTimestamp("bidDateTime"));
                bid.setUserMail(resultSet.getString("userMail"));
                bid.setIdAuction(resultSet.getInt("idAuction"));
                orderedBids.add(bid);
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
        return orderedBids;
    }

}
