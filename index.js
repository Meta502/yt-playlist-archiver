const ytpl = require('ytpl');
const ytdl = require('ytdl-core');
const fs = require('fs');

const fetchPlaylist = async (playlistId) => {
  const playlist = await ytpl(playlistId)
  return playlist;
}

const downloadPlaylist = async (playlist) => {
  if (!fs.existsSync('./output/' + playlist.id)) {
    fs.mkdirSync('./output/' + playlist.id);
  }

  playlist.items.forEach((item) => {
    const video = ytdl(item.shortUrl, {
      filter: 'audio',
      quality: 'highestaudio',
      highWaterMark: 1 << 25
    })
    video.pipe(fs.createWriteStream(`output/${playlist.id}/${item.title.replace(/[\/】]/g, " | ").replace(/[^a-z0-9 -| 一-龠 ぁ-ゔ ァ-ヴー 々〆〤ヶ]/gi, '')}.mp3`));
  })
}

const main = async () => {
  const args = process.argv;
  if (args.length < 3) throw new Error('No playlist id provided');
  if (!fs.existsSync("output")) fs.mkdirSync("output");
  const playlist = await fetchPlaylist(args[2])
  await downloadPlaylist(playlist);
}

main()