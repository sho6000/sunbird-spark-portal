import { FiAlertTriangle, FiArrowLeft, FiClock, FiMail, FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/common/Button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/common/InputOTP";
import { useAppI18n } from "@/hooks/useAppI18n";
import { OTP_REGEX } from "@/utils/ValidationUtils";
import { formatTime } from "@/utils/profileUtils";

export { CONDITION_KEYS, ConsentStep } from "./ConsentStep";

interface OtpStepProps {
    email: string | undefined;
    otp: string;
    setOtp: (v: string) => void;
    resendCounter: number;
    resendDisabled: boolean;
    submitting: boolean;
    errorMessage: string;
    onResend: () => void;
    onConfirm: () => void;
    onBack: () => void;
}

export const OtpStep = ({
    email,
    otp,
    setOtp,
    resendCounter,
    resendDisabled,
    submitting,
    errorMessage,
    onResend,
    onConfirm,
    onBack,
}: OtpStepProps) => {
    const { t } = useAppI18n();
    return (
        <div className="space-y-6">
            <div className="flex items-start gap-3 sm:gap-4">
                <span className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-sunbird-brick">
                    <FiMail className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                    <h2 className="font-rubik font-medium text-lg text-foreground leading-tight">
                        {t("deleteAccount.otpTitle")}
                    </h2>
                    <p className="font-rubik text-sm text-sunbird-gray-4a mt-1 break-words">
                        {t("deleteAccount.otpSubtitle", { email: email || "" })}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-3 py-3 sm:px-4 sm:py-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-red-600">
                    <FiAlertTriangle className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="font-rubik text-sm text-red-600">
                    {t("deleteAccount.warning")}
                </p>
            </div>

            <div className="space-y-3">
                <p className="font-rubik font-semibold text-sm text-sunbird-obsidian">
                    {t("deleteAccount.otpLabel")}
                </p>
                <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(v) => setOtp(v.replace(/[^0-9]/g, ""))}
                    pattern="^[0-9]*$"
                    inputMode="numeric"
                >
                    <InputOTPGroup className="gap-1.5 sm:gap-2">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            <InputOTPSlot
                                key={i}
                                index={i}
                                className="w-9 h-10 text-base sm:w-12 sm:h-12 sm:text-lg md:w-[50px] md:h-[50px] md:text-[18px] font-semibold border border-[hsl(var(--sunbird-gray-d9))] rounded-[10px] font-rubik focus:border-[hsl(var(--sunbird-ginger))] focus:ring-1 focus:ring-[hsl(var(--sunbird-ginger))]"
                            />
                        ))}
                    </InputOTPGroup>
                </InputOTP>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-rubik">
                <div className="flex items-center gap-2 text-sunbird-gray-4a">
                    <FiClock className="h-4 w-4" aria-hidden="true" />
                    <span>
                        {t("deleteAccount.codeExpires")}{" "}
                        <span className="font-semibold text-sunbird-obsidian">
                            {formatTime(resendCounter)}
                        </span>
                    </span>
                </div>
                <button
                    type="button"
                    onClick={onResend}
                    disabled={resendDisabled}
                    className="font-medium text-sunbird-brick hover:text-sunbird-brick/80 transition-colors disabled:text-sunbird-gray-4a/60 disabled:cursor-not-allowed"
                >
                    {t("deleteAccount.resend")}
                </button>
            </div>

            {errorMessage && (
                <p className="text-red-600 text-sm">{errorMessage}</p>
            )}

            <hr className="border-t border-[hsl(var(--sunbird-gray-d9))]" />

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <Button
                    variant="outline"
                    onClick={onBack}
                    disabled={submitting}
                    className="w-full sm:w-auto font-rubik"
                >
                    <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
                    {t("back")}
                </Button>
                <Button
                    onClick={onConfirm}
                    disabled={!OTP_REGEX.test(otp) || submitting}
                    className="w-full sm:w-auto bg-sunbird-brick hover:bg-sunbird-brick/90 text-white font-rubik"
                    data-edataid="delete-account-confirm"
                >
                    <FiTrash2 className="h-4 w-4" aria-hidden="true" />
                    {submitting ? t("deleteAccount.deleting") : t("deleteAccount.confirm")}
                </Button>
            </div>
        </div>
    );
};
