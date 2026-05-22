import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";
import { useAppI18n } from "@/hooks/useAppI18n";
import { useIsAuthenticated } from "@/hooks/useAuthInfo";
import PageLoader from "@/components/common/PageLoader";
import sunbirdLogo from "@/assets/sunbird-logo.svg";

const DELETE_ACCOUNT_PATH = "/profile/delete-account";

const DeleteAccountLanding = () => {
    const { t } = useAppI18n();
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useIsAuthenticated();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate(DELETE_ACCOUNT_PATH, { replace: true });
        }
    }, [isLoading, isAuthenticated, navigate]);

    const handleLogin = () => {
        const returnTo = encodeURIComponent(DELETE_ACCOUNT_PATH);
        window.location.href = `/portal/login?prompt=none&returnTo=${returnTo}`;
    };

    if (isLoading || isAuthenticated) {
        return (
            <main className="profile-main-content delete-account-main bg-white">
                <PageLoader fullPage={false} />
            </main>
        );
    }

    return (
        <main className="profile-main-content delete-account-main bg-white">
            <div className="delete-account-container">
                <img
                    src={sunbirdLogo}
                    alt="Sunbird"
                    className="delete-account-logo"
                />
                <div className="delete-account-page text-center">
                <div className="delete-account-icon-wrapper">
                    <span className="delete-account-icon-badge">
                        <FiAlertCircle className="delete-account-icon" aria-hidden="true" />
                    </span>
                </div>
                <h1 className="delete-account-title text-center">
                    {t("deleteAccountLanding.title")}
                </h1>
                <p className="delete-account-message">
                    {t("deleteAccountLanding.message")}
                </p>
                <button
                    type="button"
                    onClick={handleLogin}
                    className="delete-account-login-btn"
                    data-edataid="delete-account-landing-login"
                >
                    {t("deleteAccountLanding.loginCta")}
                </button>
                </div>
            </div>
        </main>
    );
};

export default DeleteAccountLanding;
