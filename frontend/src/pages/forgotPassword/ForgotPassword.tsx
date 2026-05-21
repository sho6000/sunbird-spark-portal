import React, { useState, useEffect } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useLearnerFuzzySearch, useResetPassword } from '@/hooks/useUser';
import { useGenerateOtp, useVerifyOtp } from '@/hooks/useOtp';
import { Step, OtpIdentifier } from '../../types/forgotPasswordTypes';
import { IdentifyUser } from './IdentifyUser';
import { SelectOTPDelivery } from './SelectOTPDelivery';
import { VerifyOTP } from './VerifyOTP';
import { useSystemSetting } from '@/hooks/useSystemSetting';
import { getSafeRedirectUrl, isMobileApp, persistMobileContext } from '@/utils/forgotPasswordUtils';
import { TelemetryTracker } from '@/components/telemetry/TelemetryTracker';
import useImpression from '@/hooks/useImpression';
import { useTelemetry } from '@/hooks/useTelemetry';
import { LANGUAGE_STORAGE_KEY, LANGUAGE_MAP, type SupportedLanguage } from '@/configs/languages';
import i18n from '@/configs/i18n';
import { useTheme } from '@/providers/ThemeProvider';
import type { TemplateOption } from '@/theme/themes';

const ForgotPassword: React.FC = () => {
  const { mutateAsync: searchUser } = useLearnerFuzzySearch();
  const { mutateAsync: generateOtp } = useGenerateOtp();
  const { mutateAsync: verifyOtp } = useVerifyOtp();
  const { mutateAsync: resetPassword } = useResetPassword();
  const telemetry = useTelemetry();
  const { setTheme, setFont, setTemplate } = useTheme();

  useImpression({ type: 'view', pageid: 'forgot-password' });

  // Persist mobile context, language, and theme prefs on mount
  useEffect(() => {
    if (isMobileApp()) {
      persistMobileContext();
    }
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    if (lang && LANGUAGE_MAP[lang as SupportedLanguage]) {
      try { localStorage.setItem(LANGUAGE_STORAGE_KEY, lang); } catch { /* storage unavailable */ }
      void i18n.changeLanguage(lang).catch((err) => { console.error('Failed to change language to', lang, err); });
    }
    const theme = params.get('theme');
    if (theme) setTheme(theme);
    const font = params.get('font');
    if (font) setFont(font);
    const template = params.get('template');
    if (template) setTemplate(template as TemplateOption['id']);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [step, setStep] = useState<Step>(1);
  const [validIdentifiers, setValidIdentifiers] = useState<OtpIdentifier[]>([]);
  const [selectedIdentifier, setSelectedIdentifier] = useState<OtpIdentifier | null>(null);

  const { data: captchaSiteKeyData } = useSystemSetting('portal_google_recaptcha_site_key');
  const googleCaptchaSiteKey = (captchaSiteKeyData?.data as any)?.response?.value || '';

  const handleIdentifySuccess = (identifiers: OtpIdentifier[]) => {
    telemetry.log({
      edata: { type: 'api', level: 'INFO', message: 'Forgot password: user identified', pageid: 'forgot-password' },
    });
    setValidIdentifiers(identifiers);
    setStep(2);
  };

  const handleOtpDeliverySuccess = (identifier: OtpIdentifier) => {
    telemetry.log({
      edata: { type: 'api', level: 'INFO', message: 'Forgot password: OTP delivery method selected', pageid: 'forgot-password' },
    });
    setSelectedIdentifier(identifier);
    setStep(3);
  };

  const isMobileRedirect = isMobileApp();

  return (
    <AuthLayout onClose={() => {
      window.location.href = getSafeRedirectUrl();
    }} hideClose={isMobileRedirect}>
      <TelemetryTracker 
        startEventInput={{ type: 'workflow', mode: 'password-reset', pageid: 'forgot-password-page' }}
        endEventInput={{ type: 'workflow', mode: 'password-reset', pageid: 'forgot-password-page' }}
      />
      <div className="w-full font-rubik">
        {step === 1 && (
          <IdentifyUser
            googleCaptchaSiteKey={googleCaptchaSiteKey}
            searchUser={searchUser}
            onSuccess={handleIdentifySuccess}
          />
        )}

        {step === 2 && (
          <SelectOTPDelivery
            validIdentifiers={validIdentifiers}
            googleCaptchaSiteKey={googleCaptchaSiteKey}
            generateOtp={generateOtp}
            onSuccess={handleOtpDeliverySuccess}
          />
        )}

        {step === 3 && selectedIdentifier && (
          <VerifyOTP
            selectedIdentifier={selectedIdentifier}
            googleCaptchaSiteKey={googleCaptchaSiteKey}
            verifyOtp={verifyOtp}
            resetPassword={resetPassword}
            generateOtp={generateOtp}
          />
        )}

      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;