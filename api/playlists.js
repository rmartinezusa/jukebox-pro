const express = require("express");
const router = express.Router();
module.exports = router;

const { authenticate } = require("./auth");
const prisma = require("../prisma");

router.get("/", authenticate, async (req, res, next) => {
    try {
        const playlists = await prisma.playlist.findMany({
            where: { ownerId: req.user.id },
        });
        res.json(playlists);
    } catch (e) {
        next(e);
    }
});

router.post("/", authenticate, async (req, res, next) => {
    try {
        const { name, description, trackIds } = req.body;
        
        const tracks = trackIds.map((id) => ({ id }));
        const playlist = await prisma.playlist.create({
            data: {
                name,
                description,
                ownerId: req.user.id,
                tracks: { connect: tracks },
            },
        });
        res.status(201).json(playlist);
    } catch (e) {
        next(e);
    }
});

router.get("/:id", authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;
        const playlist = await prisma.playlist.findUniqueOrThrow({
            where: { id: +id },
            include: { tracks: true },
        });

        if (playlist.ownerId !== req.user.id) {
            return next({ status: 403, message: "You are not the owner of the playlist." });
        }
        res.json(playlist);
    } catch (e) {
        next(e);
    }
});
