import { BANDS } from "../constants";

import { SET_EQ_ON, SET_EQ_OFF, SET_BAND_VALUE } from "../actionTypes";
import { Band, Dispatchable } from "../types";

const BAND_SNAP_DISTANCE = 10;
const BAND_MID_POINT_VALUE = 50;
export function setEqBand(band: Band, value: number): Dispatchable {
  if (
    value < BAND_MID_POINT_VALUE + BAND_SNAP_DISTANCE &&
    value > BAND_MID_POINT_VALUE - BAND_SNAP_DISTANCE
  ) {
    return { type: SET_BAND_VALUE, band, value: BAND_MID_POINT_VALUE };
  }
  return { type: SET_BAND_VALUE, band, value };
}

function _setEqTo(value: number): Dispatchable {
  return dispatch => {
    Object.values(BANDS).forEach(band => {
      dispatch({
        type: SET_BAND_VALUE,
        value,
        band: band
      });
    });
  };
}

export function setEqToMax(): Dispatchable {
  return _setEqTo(100);
}

export function setEqToMid(): Dispatchable {
  return _setEqTo(50);
}

export function setEqToMin(): Dispatchable {
  return _setEqTo(0);
}

export function setPreamp(value: number): Dispatchable {
  return { type: SET_BAND_VALUE, band: "preamp", value };
}

export function toggleEq(): Dispatchable {
  return (dispatch, getState) => {
    if (getState().equalizer.on) {
      dispatch({ type: SET_EQ_OFF });
    } else {
      dispatch({ type: SET_EQ_ON });
    }
  };
}
