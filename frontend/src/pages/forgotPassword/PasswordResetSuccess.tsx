import React, { useEffect } from 'react';
import { FiCheck } from 'react-icons/fi';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Header, PrimaryButton } from './ForgotPasswordComponents';
import { getSafeRedirectUrl, isMobileApp } from '@/utils/forgotPasswordUtils';
import { useAppI18n } from '@/hooks/useAppI18n';
import { useTheme } from '@/providers/ThemeProvider';
import type { TemplateOption } from '@/theme/themes';
import { LANGUAGE_STORAGE_KEY, LANGUAGE_MAP, type SupportedLanguage } from '@/configs/languages';
import i18n from '@/configs/i18n';

const PasswordResetSuccess: React.FC = () => {
    const { t } = useAppI18n();
    const isMobileRedirect = isMobileApp();
    const { setTheme, setFont, setTemplate } = useTheme();

    useEffect(() => {
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

    const onProceedToLogin = () => {
        window.location.href = getSafeRedirectUrl();
    };

    return (
        <AuthLayout onClose={() => { window.location.href = getSafeRedirectUrl(); }} hideClose={isMobileRedirect}>
            <div className="flex flex-col items-center">
                <Header
                    title={t('passwordReset.congratulations', { defaultValue: 'Congratulations!' })}
                    subtitle={t('passwordReset.successMessage', { defaultValue: 'Your password has been successfully reset.' })}
                />

                <div className="flex justify-center mb-10">
                    <div className="success-icon-container">
                        <FiCheck className="success-icon-check" />
                    </div>
                </div>

                <PrimaryButton onClick={onProceedToLogin}>
                    {t('passwordReset.proceedToLogin', { defaultValue: 'Proceed to Login' })}
                </PrimaryButton>
            </div>
        </AuthLayout>
    );
};

export default PasswordResetSuccess;
