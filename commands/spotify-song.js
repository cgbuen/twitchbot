const fs = require('fs')
const requestSpotify = require('../helpers/request-spotify')
const { TOKEN_STORE } = require('../vars')

const MSGS = {
  BROKEN_SPOTIFY: 'music integration is broken lmao',
  NOT_PLAYING: 'https://www.youtube.com/@SmoothSounds'
}

module.exports = async function song() {
  const accessToken = fs.readFileSync(`./${TOKEN_STORE}/spotify-access`)
  const currentlyPlayingData = await requestSpotify.currentlyPlaying(accessToken)
  if (currentlyPlayingData && currentlyPlayingData.error) {
    // if other error, just tell the user it's broken
    console.log(`==> Miscellaneous error: ${currentlyPlayingData.error}`)
    const msg = MSGS.BROKEN_SPOTIFY
    return msg

  } else if (currentlyPlayingData && currentlyPlayingData.is_playing && currentlyPlayingData.item && currentlyPlayingData.device) {
    // if you are playing something, display
    console.log('==> Song currently playing.')
    const artists = (currentlyPlayingData.item.artists && currentlyPlayingData.item.artists.map(item => item.name).join(', ')) || 'n/a'
    const title = currentlyPlayingData.item.name || 'n/a'
    const album = (currentlyPlayingData.item.album && currentlyPlayingData.item.album.name) || 'n/a'
    const msg = `${artists} - ${title} [${album}]`
    return msg

  } else if (currentlyPlayingData) {
    // if not playing anything, tell user you're not playing anything
    console.log(`==> No song currently playing.${currentlyPlayingData.noSession ? ' (No current session.)' : ''}`)
    const msg = MSGS.NOT_PLAYING
    return msg

  } else {
    // fallback
    console.log('==> currentlyPlayingData not provided.')
    const msg = MSGS.BROKEN_SPOTIFY
    return msg
  }
}
