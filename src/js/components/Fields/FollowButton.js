
import React from 'react';
import { connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';

import Link from '../Link';

import * as helpers from '../../helpers';
import * as uiActions from '../../services/ui/actions';
import * as spotifyActions from '../../services/spotify/actions';

class FollowButton extends React.Component {
  remove() {
    const { spotifyActions: actions, uri } = this.props;
    actions.following(uri, 'DELETE');
  }

  add() {
    const { spotifyActions: actions, uri } = this.props;
    actions.following(uri, 'PUT');
  }

  render() {
    const {
      uri,
      addText,
      removeText,
      spotify_authorized,
      is_following,
      uiActions: actions,
      load_queue,
    } = this.props;

    let { className } = this.props;

    if (!uri) return null;

    className += ' button';
    if (helpers.isLoading(load_queue, [
      'spotify_me/tracks?',
      'spotify_me/albums?',
      'spotify_me/following?',
      `spotify_playlists/${helpers.getFromUri('playlistid', uri)}/followers?`,
    ])) {
      console.log("LOADING")
      className += ' button--working';
    }

    if (!spotify_authorized) {
      return (
        <button
          type="button"
          className={`${className} button--disabled`}
          onClick={() => actions.createNotification({ content: 'You must authorize Spotify first', type: 'warning' })}
        >
          {addText}
        </button>
      );
    } if (is_following === true) {
      return (
        <button
          type="button"
          className={`${className} button--destructive`}
          onClick={() => this.remove()}
        >
          {removeText}
        </button>
      );
    }
    return (
      <button
        type="button"
        className={`${className} button--default`}
        onClick={() => this.add()}
      >
        {addText}
      </button>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  load_queue: state.ui.load_queue,
  spotify_authorized: state.spotify.authorization,
});

const mapDispatchToProps = (dispatch) => ({
  uiActions: bindActionCreators(uiActions, dispatch),
  spotifyActions: bindActionCreators(spotifyActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(FollowButton);
