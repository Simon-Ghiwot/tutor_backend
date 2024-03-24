const connection = require("./database");
const mysql = require("mysql");

const db = mysql.createPool(connection);

const calculateRating = async (req, res) => {
  const { tutor_id, student_id } = req.params;
  const { score, hours, comment } = req.body;
  const course_name = 'Biology';

  try {
    const insertQuery =
      "INSERT INTO Rating (tutor_id, student_id, score, hours, comment, course_name) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
      insertQuery,
      [tutor_id, student_id, score, hours, comment, course_name],
      (insertError) => {
        if (insertError) {
          console.log(insertError);
          res.status(500).json({ success: false, message: "Database error" });
        } else {
          // Fetch tutor data and calculate new total rating
          const fetchQuery =
            "SELECT rating, rating_count FROM Tutor WHERE id = ?";
          db.query(fetchQuery, [tutor_id], (fetchError, fetchResult) => {
            if (fetchError) {
              res
                .status(500)
                .json({ success: false, message: "Database error" });
            } else {
              const { rating, rating_count } = fetchResult[0];
              const newTotalRating =
                (rating * rating_count + score) / (rating_count + 1);
              const newRatingCount = rating_count + 1;

              // Update tutor table with new total rating
              const updateQuery =
                "UPDATE Tutor SET rating = ?, rating_count = ? WHERE id = ?";
              db.query(
                updateQuery,
                [newTotalRating, newRatingCount, tutor_id],
                (updateError) => {
                  if (updateError) {
                    res
                      .status(500)
                      .json({ success: false, message: "Database error" });
                  } else {
                    res.status(200).json({
                      success: true,
                      message: "Rating calculated and updated successfully",
                    });
                  }
                }
              );
            }
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: "Task failed, try again" });
  }
};

const getRating = async (req, res) => {
  const { tutor_id } = req.params;

  try {
    const fetchQuery = "SELECT * FROM Rating WHERE tutor_id = ?";
    db.query(fetchQuery, [tutor_id], (fetchError, fetchResult) => {
      if (fetchError) {
        res.status(500).json({ success: false, message: "Database error" });
      } else {
        res.status(200).json({ success: true, data: fetchResult });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Task failed, try again" });
  }
}

module.exports = { calculateRating, getRating };
