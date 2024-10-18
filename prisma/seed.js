const { faker } = require("@faker-js/faker");
const prisma = require("../prisma");

async function seed(numTracks = 20){
    const tracks = Array.from({ length: numTracks }, () => ({
        name: faker.music.songName(),
    }));
    await prisma.track.createMany({ data: tracks });
};

seed().catch((e) => {
    console.error(e);
    // to end process
    process.exit(1); 
});

