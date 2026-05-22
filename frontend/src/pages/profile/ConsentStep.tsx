import type { ComponentType, SVGProps } from "react";
import {
    FiAlertTriangle,
    FiDatabase,
    FiDownload,
    FiKey,
    FiMail,
    FiTrash2,
    FiUsers,
} from "react-icons/fi";
import { Button } from "@/components/common/Button";
import { useAppI18n } from "@/hooks/useAppI18n";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface ConsentSection {
    titleKey: string;
    Icon: IconType;
    iconClass: string;
    keys: string[];
}

const CONSENT_SECTIONS: ConsentSection[] = [
    {
        titleKey: "deleteAccount.sections.data",
        Icon: FiDatabase,
        iconClass: "bg-red-50 text-red-600",
        keys: [
            "deleteAccount.conditions.permanent",
            "deleteAccount.conditions.featureLoss",
            "deleteAccount.conditions.noRestore",
        ],
    },
    {
        titleKey: "deleteAccount.sections.access",
        Icon: FiKey,
        iconClass: "bg-amber-50 text-amber-600",
        keys: [
            "deleteAccount.conditions.ssoNoRecreate",
            "deleteAccount.conditions.contentLoss",
        ],
    },
    {
        titleKey: "deleteAccount.sections.content",
        Icon: FiUsers,
        iconClass: "bg-orange-50 text-orange-600",
        keys: ["deleteAccount.conditions.dataRetention"],
    },
    {
        titleKey: "deleteAccount.sections.proceed",
        Icon: FiDownload,
        iconClass: "bg-emerald-50 text-emerald-600",
        keys: ["deleteAccount.conditions.understand"],
    },
];

export const CONDITION_KEYS = CONSENT_SECTIONS.flatMap((s) => s.keys) as readonly string[];

interface ConsentStepProps {
    email: string | undefined;
    checkedConditions: Record<string, boolean>;
    toggleCondition: (key: string) => void;
    allConditionsAccepted: boolean;
    isSending: boolean;
    errorMessage: string;
    onSendOtp: () => void;
    onCancel: () => void;
}

export const ConsentStep = ({
    email,
    checkedConditions,
    toggleCondition,
    allConditionsAccepted,
    isSending,
    errorMessage,
    onSendOtp,
    onCancel,
}: ConsentStepProps) => {
    const { t } = useAppI18n();
    const total = CONDITION_KEYS.length;
    const acknowledged = CONDITION_KEYS.filter((k) => checkedConditions[k]).length;
    const progress = total === 0 ? 0 : Math.round((acknowledged / total) * 100);

    return (
        <div className="space-y-6">
            <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                        <span className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-sunbird-brick">
                            <FiTrash2 className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="flex-1 min-w-0">
                            <h1 className="font-rubik font-medium text-base sm:text-lg text-foreground leading-tight">
                                {t("deleteAccount.title")}
                            </h1>
                            <p className="font-rubik text-xs sm:text-sm text-sunbird-gray-4a mt-1">
                                {t("deleteAccount.subtitle")}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-baseline justify-between gap-2 sm:flex-col sm:items-end sm:justify-start sm:text-right sm:shrink-0">
                        <p className="font-rubik text-[11px] font-semibold uppercase tracking-wide text-sunbird-gray-4a">
                            {t("deleteAccount.acknowledged")}
                        </p>
                        <p className="font-rubik text-lg sm:text-xl font-semibold text-sunbird-gray-4a leading-tight sm:mt-1">
                            <span className="text-sunbird-brick">{acknowledged}</span>
                            <span className="text-sunbird-gray-4a/60">/{total}</span>
                        </p>
                    </div>
                </div>
                <div
                    className="mt-4 h-1 rounded-full bg-red-50 overflow-hidden"
                    role="progressbar"
                    aria-valuenow={acknowledged}
                    aria-valuemin={0}
                    aria-valuemax={total}
                >
                    <div
                        className="h-full bg-sunbird-brick transition-[width] duration-200"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <hr className="border-t border-[hsl(var(--sunbird-gray-d9))]" />

            <div className="flex items-center gap-2 sm:gap-3 rounded-lg border border-red-200 bg-red-50 px-2.5 py-2 sm:px-3 sm:py-2.5">
                <span className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-white text-red-600">
                    <FiAlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                </span>
                <p className="font-rubik text-xs sm:text-sm text-red-600">
                    {t("deleteAccount.warning")}
                </p>
            </div>

            {CONSENT_SECTIONS.map(({ titleKey, Icon, iconClass, keys }) => (
                <section key={titleKey} className="space-y-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className={`flex h-6 w-6 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-sm ${iconClass}`}>
                            <Icon className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                        </span>
                        <h2 className="font-rubik font-semibold text-[11px] sm:text-xs uppercase tracking-wide text-sunbird-obsidian">
                            {t(titleKey)}
                        </h2>
                        <span className="flex-1 h-px bg-[hsl(var(--sunbird-gray-d9))]" />
                    </div>
                    <ul className="space-y-2 pl-6 sm:pl-11">
                        {keys.map((key) => (
                            <li key={key}>
                                <label
                                    htmlFor={key}
                                    className="flex items-center gap-2 py-0.5 sm:gap-3 sm:py-1 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        id={key}
                                        checked={!!checkedConditions[key]}
                                        onChange={() => toggleCondition(key)}
                                        className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded accent-sunbird-brick cursor-pointer shrink-0"
                                    />
                                    <span className="font-rubik text-xs sm:text-sm text-sunbird-obsidian leading-snug">
                                        {t(key)}
                                    </span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}

            {errorMessage && <p className="font-rubik text-sm text-red-600">{errorMessage}</p>}

            <hr className="border-t border-[hsl(var(--sunbird-gray-d9))]" />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2 font-rubik text-xs sm:text-sm text-sunbird-gray-4a min-w-0">
                    <FiMail className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">
                        {t("deleteAccount.otpDelivery")}{" "}
                        <strong className="text-sunbird-obsidian">{email || "—"}</strong>
                    </span>
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:shrink-0">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="w-full sm:w-auto h-9 px-3 text-xs sm:h-12 sm:px-4 sm:text-sm font-rubik"
                        data-edataid="delete-account-cancel"
                    >
                        {t("cancel")}
                    </Button>
                    <Button
                        onClick={onSendOtp}
                        disabled={!allConditionsAccepted || !email || isSending}
                        className="w-full sm:w-auto h-9 px-3 text-xs sm:h-12 sm:px-4 sm:text-sm bg-sunbird-brick hover:bg-sunbird-brick/90 text-white font-rubik"
                        data-edataid="delete-account-send-otp"
                    >
                        <FiTrash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                        {isSending ? t("deleteAccount.sending") : t("deleteAccount.sendOtp")}
                    </Button>
                </div>
            </div>
        </div>
    );
};
