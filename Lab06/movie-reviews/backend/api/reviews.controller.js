import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {
    static async apiPostReview(req, res, next) {
        try {
            const movieId = req.body.movie_id;
            const review = req.body.review;
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            };
            const date = new Date();

            const reviewResponse = await ReviewsDAO.addReview(movieId, userInfo, review, date);

            res.json({ status: "success" });
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.body.review_id;
            const userId = req.body.user_id;
            const review = req.body.review;
            const date = new Date();

            const reviewResponse = await ReviewsDAO.updateReview(reviewId, userId, review, date);

            var { error } = reviewResponse;
            if (error) {
                res.status(500).json({ error: error });
            }
            if (reviewResponse.modifiedCount === 0) {
                error = "Unable to update review. User may not own this review.";
            }

            res.json({ status: "success", error: error });
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.body.review_id;
            const userId = req.body.user_id;

            const reviewResponse = await ReviewsDAO.deleteReview(reviewId, userId);

            res.json({ status: "success" });
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}





