import toast, {Toaster} from "react-hot-toast";

export default function Toast() {
    return (
        <Toaster 
            position="top-right" 
            toastOptions={{
                success: {
                    iconTheme: {
                        primary: "#10b981",
                        secondary: "white",
                    },
                },
                error: {
                    iconTheme: {
                        primary: "#ef4444",
                        secondary: "white",
                    },
                    style: {
                        background: "#ef4444",
                        color: "white",
                    },
                },
                loading: {
                    style: {
                        background: "#3b82f6",
                        color: "white",
                    },
                },
            }}
        />
    )
}