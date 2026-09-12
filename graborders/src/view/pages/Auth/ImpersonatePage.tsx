import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthToken from "src/modules/auth/authToken";
import authActions from "src/modules/auth/authActions";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ImpersonatePage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const query = useQuery();
  const token = query.get("token");

  useEffect(() => {
    if (token) {
      AuthToken.set(token, true);
      (dispatch(authActions.doRefreshCurrentUser()) as any).then(() => {
        history.replace("/");
      });
    } else {
      history.replace("/auth/signin");
    }
  }, []);

  return <div>Logging in as user...</div>;
}
