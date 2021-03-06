import React, { useCallback, useRef, useEffect } from "react";
import { WindowId, AppState, Dispatch } from "../types";
import * as Actions from "../actionCreators";
import * as Selectors from "../selectors";
import { connect } from "react-redux";

interface DispatchProps {
  setFocus(windowId: WindowId | null): void;
}
interface StateProps {
  focusedWindowId: WindowId | null;
}

interface OwnProps {
  onKeyDown?(e: KeyboardEvent): void;
  windowId: WindowId;
  children: React.ReactNode;
}

type Props = StateProps & DispatchProps & OwnProps;

function FocusTarget(props: Props) {
  const { onKeyDown, focusedWindowId, windowId, setFocus, children } = props;

  const focusHandler = useCallback(() => {
    if (windowId !== focusedWindowId) {
      setFocus(windowId);
    }
  }, [windowId, focusedWindowId, setFocus]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current } = ref;
    if (current == null || onKeyDown == null) {
      return;
    }
    current.addEventListener("keydown", onKeyDown);
    return () => current.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown, windowId, focusedWindowId]);

  useEffect(() => {
    const { current } = ref;
    if (current == null || windowId !== focusedWindowId) {
      return;
    }

    // I give up. I can't figure out how to type this.
    const out: EventListener = (e: any) => {
      if (!(e.currentTarget as Element).contains(e.relatedTarget as Element)) {
        current.focus();
      }
    };
    // https://github.com/facebook/react/issues/6410
    // React does not implement focusout. In this case we prefer focusout to
    // blur because it gets triggered when a child with focus unmounts.
    current.addEventListener("focusout", out);
    return () => current.removeEventListener("focusout", out);
  }, [windowId, focusedWindowId]);

  return (
    <div
      ref={ref}
      onMouseDown={focusHandler}
      onFocus={focusHandler}
      tabIndex={-1}
      style={{ height: "100%", width: "100%" }}
    >
      {children}
    </div>
  );
}

function mapStateToProps(state: AppState): StateProps {
  return {
    focusedWindowId: Selectors.getFocusedWindow(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    setFocus: windowId => dispatch(Actions.setFocusedWindow(windowId)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FocusTarget);
