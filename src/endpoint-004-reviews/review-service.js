const xss = require('xss')

const ReviewService = {
  getById(db, id) {
    return db
      .from('reviews AS rev')
      .select(
        'rev.id',
        'rev.rating',
        'rev.comment',
        'rev.date_submitted',
        'rev.movieId',
        db.raw(
          `row_to_json(
            (SELECT tmp FROM (
              SELECT
                usr.id,
                usr.username,
                usr.first_name,
                user.last_name
            ) tmp)
          ) AS "user"`
        )
      )
      .leftJoin(
        'users AS usr',
        'rev.userId',
        'usr.id',
      )
      .where('rev.id', id)
      .first()
  },

  insertReview(db, newReview) {
    return db
      .insert(newReview)
      .into('reviews')
      .returning('*')
      .then(([review]) => review)
      .then(review =>
        ReviewsService.getById(db, review.id)
      )
  },

  serializeReview(review) {
    return {
      id: review.id,
      rating: review.rating,
      comment: xss(comment.text),
      movie: review.movie || {},
      date_created: review.date_created,
      user: review.user || {},
    }
  }
}

module.exports = ReviewService
