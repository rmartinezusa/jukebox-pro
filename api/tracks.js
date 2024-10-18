const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

router.get("/", async (req, res, next) => {
    try {
        const tracks = await prisma.track.findMany();
        res.json(tracks);
    } catch (e) {
        next(e);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        //const loggedInUserPlaylists = req.user ? { where: { ownerId: req.user.id } } : false;

        const track = await prisma.track.findUniqueOrThrow({
            where: { id: +id },
            include: {
                playlists: req.user ? { where: { ownerId: req.user.id } } : undefined,
            },
        });
        res.json(track);
    } catch (e) {
        next(e);
    }
});