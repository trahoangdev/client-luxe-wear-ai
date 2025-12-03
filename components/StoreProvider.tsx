"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import { useEffect } from "react";
import { getMe, getAccessToken } from "@/services/authUserService";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/authSlice";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  // Bootstrap user from token if present
  const Bootstrapper = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
      const boot = async () => {
        const token = getAccessToken();
        if (!token) return;
        try {
          const res = await getMe();
          if (res?.success && res.data?.user) {
            dispatch(
              setCredentials({
                user: {
                  ...res.data.user,
                  memberships: res.data.memberships,
                },
                accessToken: token,
              })
            );
          }
        } catch {}
      };
      boot();
    }, [dispatch]);
    return null;
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Bootstrapper />
        {children}
      </PersistGate>
    </Provider>
  );
}
