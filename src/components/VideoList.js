import React, { Component } from 'react';
import YouTube from 'react-youtube';
import api from '../services/Api';

export default class VideoList extends Component {
  render() {
    const videoList = [
      {
        name: "NAVIGATION",
        desc: "Learn how to move around the app.",
        videoIdYouTube: "kcLIqGuFHDg"
      },
      {
        name: "SETTINGS",
        desc: "How to setup product costs information and create SKU groups.",
        videoIdYouTube: "bAmn4eS5-10"
      },
      {
        name: "CHARTS",
        desc: "Control your chart views.",
        videoIdYouTube: "pY-3qZIXq34"
      },
      {
        name: "FINANCIAL DASHBOARD",
        desc: "Understand net and gross profit and how to read trend charts.",
        videoIdYouTube: "oK3ebrIiFFc"
      },
      {
        name: "BUSINESS RESULTS DASHBOARD",
        desc: "Learn how to quickly scan revenue, sales quantity, pricing and profit margin.",
        videoIdYouTube: "_nk0VGcM5lc"
      },
      {
        name: "OPERATIONS DASHBOARD",
        desc: "Understand how key performance metrics can save you time in managing the business.",
        videoIdYouTube: "xrpdlKM3yH8"
      }
    ]

    return (
      <div className="video-list">
        <h2 className="video-list__title">Quick introductions to get you started</h2>
        <div className="video-list__grid">
          {videoList.map((video, i) => {
            return (
              <VideoEl
                key={i}
                name={video.name}
                desc={video.desc}
                videoIdYouTube={video.videoIdYouTube} />
            )
          })}
        </div>
      </div>
    )
  }
}

const VideoEl = (props) => {
  const { name, desc, videoIdYouTube } = props

  const _onPlay = (event) => {
    api
      .post(`VideoWatched`)
      .then((res) => {
        console.log('back-end responce to post videowatched', res)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div className="video-list__col">
      <div className="video-element">
        <div className="video-element__scaler">
          <div className="video-element__frame">
            <YouTube
              videoId={videoIdYouTube}
              onPlay={_onPlay}
              opts={{
                height: '100%',
                width: '100%',
                playerVars: {
                  // https://developers.google.com/youtube/player_parameters
                  autoplay: 0,
                  controls: 1,
                  showinfo: 0,
                  iv_load_policy: 3
                }
              }}
            />
          </div>
        </div>
        <div className="video-element__info">
          <div className="video-element__name">{name}</div>
          <div className="video-element__desc">{desc}</div>
        </div>
      </div>
    </div>
  )
}