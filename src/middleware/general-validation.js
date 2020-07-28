const {GeneralService}= require('../service/api-service')

async function checkItemExists(req, res, next,dbName) {
    try {
        const item = await GeneralService.getItemById(req.app.get('db'),dbName,req.params.id)
        if (!item) {
        return res.status(404).json({error: `Requested item doesn't exist`})
        }
        res.item = item
        next()
    } catch (error) {
        next(error)
    }
}

module.exports= {checkItemExists}