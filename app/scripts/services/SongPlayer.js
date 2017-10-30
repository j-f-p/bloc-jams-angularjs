(function() {
  function SongPlayer($rootScope, Fixtures) {
    /**
    * @desc scope object
    * @type {Object}
    */
    let SongPlayer = {};

    /**
    * @desc album object
    * @type {Object}
    */
    let currentAlbum = Fixtures.getAlbum();

    /**
    * @desc Buzz object audio file
    * @type {Object}
    */
    let currentBuzzObject = null;

    /**
    * @function setSong
    * @desc Stops currently playing song and loads new audio file
    * @param {Object} song
    */
    let setSong = function(song) {
      if(currentBuzzObject) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      }

      currentBuzzObject = new buzz.sound(song.audioUrl,
      { formats: ['mp3'], preload: true} );

      currentBuzzObject.bind('timeupdate', function() {
        $rootScope.$apply(function() {
          SongPlayer.currentTime = currentBuzzObject.getTime();
          SongPlayer.volume = currentBuzzObject.getVolume();
        });
      });
      SongPlayer.currentSong = song;
    };

    /**
    * @function playSong
    * @desc Plays set song
    * @param {Object} song
    */
    let playSong = function(song) {
      currentBuzzObject.play();
      song.playing = true;
    };

    /**
    * @function stopSong
    * @desc stops playing song
    * @param {Object} song
    */
    let stopSong = function(song) {
      currentBuzzObject.stop();
      song.playing = null;
    };

    /**
    * @function getSongIndex
    * @desc retrieves index of song
    * @param {Object} song
    */
    let getSongIndex = function(song) {
      return currentAlbum.songs.indexOf(song);
    };

    /**
    * @desc song object
    * @type {Object}
    */
    SongPlayer.currentSong = null;
    /**
    * @desc Current playback time (in seconds) of currently playing song
    * @type {Number}
    */
    SongPlayer.currentTime = null;
    /**
    * @desc Volume
    * @type {Number}
    */
    SongPlayer.volume = null;

    /**
    * @function play
    * @desc executes logic for playing song upon click of play button
    * @param {Object} song
    */
    SongPlayer.play = function(song) {
      if( SongPlayer.currentSong===null && (song===null || song==undefined) )
        return;

      song = song || SongPlayer.currentSong;
      if(SongPlayer.currentSong !== song) {
        setSong(song);
        playSong(song);
      } else if (SongPlayer.currentSong===song) {
        if(currentBuzzObject.isPaused()) {
          currentBuzzObject.play();
        }
      }
    };

    /**
    * @function pause
    * @desc executes logic for pausing song upon click of pause button
    * @param {Object} song
    */
    SongPlayer.pause = function(song) {
        song = song || SongPlayer.currentSong;
        currentBuzzObject.pause();
        song.playing = false;
    };

    /**
    * @function previous
    * @desc plays previous song upon click of previous button
    */
    SongPlayer.previous = function() {
      let currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if(currentSongIndex<0) {
        let song = currentAlbum.songs[0];
        stopSong(song);
      } else {
        let song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    /**
    * @function next
    * @desc plays next song upon click of next button
    */
    SongPlayer.next = function() {
      let currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++;

      if(currentSongIndex>currentAlbum.songs.length-1) {
        let song = currentAlbum.songs[currentAlbum.songs.length-1];
        stopSong(song);
      } else {
        let song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    /**
    * @function setCurrentTime
    * @desc Set current time (in seconds) of currently playing song
    * @param {Number} time
    */
    SongPlayer.setCurrentTime = function(time) {
      if(currentBuzzObject) {
        currentBuzzObject.setTime(time);
      }
    }

    /**
    * @function setVolume
    * @desc sets volume
    * @param {Object} volume
    */
    SongPlayer.setVolume = function(volume) {
      if(currentBuzzObject) {
        currentBuzzObject.setVolume(volume);
      }
    }

    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
