import { withFormik, FormikProps } from 'formik';
import { noop } from 'lodash';
import React, { memo, useCallback, FunctionComponent } from 'react';
import { object, string } from 'yup';

import { preventDefault } from '../common/dom';
import { withLanguage, TranslatedHtml, TranslatedLink, TranslatedString, WithLanguageProps } from '../locale';
import { Alert, AlertType } from '../ui/alert';
import { Button, ButtonVariant } from '../ui/button';
import { Fieldset, Form, Legend } from '../ui/form';

import getEmailValidationSchema from './getEmailValidationSchema';
import mapErrorMessage from './mapErrorMessage';
import CustomerViewType from './CustomerViewType';
import EmailField from './EmailField';
import PasswordField from './PasswordField';

export interface LoginFormProps {
    canCancel?: boolean;
    email?: string;
    forgotPasswordUrl: string;
    isSignInEmailEnabled?: boolean;
    isSendingSignInEmail?: boolean;
    isSigningIn?: boolean;
    signInError?: Error;
    signInEmailError?: Error;
    viewType?: Omit<CustomerViewType, 'guest'>;
    passwordlessLogin?: boolean;
    shouldShowCreateAccountLink?: boolean;
    onCancel?(): void;
    onCreateAccount?(): void;
    onChangeEmail?(email: string): void;
    onSignIn(data: LoginFormValues): void;
    onSendLoginEmail?(): void;
    onContinueAsGuest?(): void;
}

export interface LoginFormValues {
    email: string;
    password: string;
}

const LoginForm: FunctionComponent<LoginFormProps & WithLanguageProps & FormikProps<LoginFormValues>> = ({
    canCancel,
    forgotPasswordUrl,
    email,
    isSignInEmailEnabled,
    isSigningIn,
    language,
    onCancel = noop,
    onChangeEmail,
    onContinueAsGuest,
    onCreateAccount = noop,
    onSendLoginEmail = noop,
    signInError,
    shouldShowCreateAccountLink,
    viewType = CustomerViewType.Login,
}) => {
    const changeEmailLink = useCallback(() => {
        if (!email) {
            return null;
        }

        return (
            <p className="optimizedCheckout-contentSecondary">
                <TranslatedLink
                    data={ { email } }
                    id="customer.guest_could_login_change_email"
                    onClick={ onCancel }
                    testId="change-email"
                />
            </p>
        );
    }, [email, onCancel]);

    return (
        <Form
            className="checkout-form"
            id="checkout-customer-returning"
            testId="checkout-customer-returning"
        >
            <Fieldset legend={
                <Legend hidden>
                    <TranslatedString id="customer.returning_customer_text" />
                </Legend>
            }
            >
                { signInError && <Alert
                    testId="customer-login-error-message"
                    type={ AlertType.Error }
                >
                    { mapErrorMessage(signInError, key => language.translate(key)) }
                </Alert> }

                { viewType === CustomerViewType.SuggestedLogin &&
                    <Alert type={ AlertType.Info }>
                        <TranslatedHtml
                            data={ { email } }
                            id="customer.guest_could_login"
                        />
                    </Alert> }

                { viewType === CustomerViewType.Login && shouldShowCreateAccountLink && <p>
                    <TranslatedLink
                        id="customer.create_account_to_continue_text"
                        onClick={ onCreateAccount }
                    />
                </p> }

                { viewType === CustomerViewType.CancellableEnforcedLogin &&
                    <Alert type={ AlertType.Info }>
                        <TranslatedHtml
                            data={ { email } }
                            id="customer.guest_must_login"
                        />
                    </Alert> }

                { viewType === CustomerViewType.EnforcedLogin &&
                    <Alert type={ AlertType.Error }>
                        <TranslatedLink
                            id="customer.guest_temporary_disabled"
                            onClick={ onCreateAccount }
                        />
                    </Alert> }

                { (viewType === CustomerViewType.Login || viewType === CustomerViewType.EnforcedLogin) &&
                    <EmailField onChange={ onChangeEmail } /> }

                <PasswordField forgotPasswordUrl={ isSignInEmailEnabled ? undefined : forgotPasswordUrl } />

                { isSignInEmailEnabled && <p>
                    <TranslatedLink
                        id="login_email.link"
                        onClick={ onSendLoginEmail }
                        testId="customer-signin-link"
                    />
                </p> }

                <div className="form-actions">
                    <Button
                        disabled={ isSigningIn }
                        id="checkout-customer-continue"
                        testId="customer-continue-button"
                        type="submit"
                        variant={ ButtonVariant.Primary }
                    >
                        <TranslatedString id="customer.sign_in_action" />
                    </Button>

                    { viewType === CustomerViewType.SuggestedLogin && <a
                        className="button optimizedCheckout-buttonSecondary"
                        data-test="customer-guest-continue"
                        href="#"
                        id="checkout-guest-continue"
                        onClick={ preventDefault(onContinueAsGuest) }
                    >
                        Continue As Guest
                    </a> }

                    { canCancel &&
                        viewType !== CustomerViewType.EnforcedLogin &&
                        viewType !== CustomerViewType.SuggestedLogin &&
                        <a
                            className="button optimizedCheckout-buttonSecondary"
                            data-test="customer-cancel-button"
                            href="#"
                            id="checkout-customer-cancel"
                            onClick={ preventDefault(onCancel) }
                        >
                            <TranslatedString id={ viewType === CustomerViewType.CancellableEnforcedLogin ?
                                'login_email.use_another_email' :
                                'common.cancel_action' }
                            />
                        </a> }
                </div>

                { viewType === CustomerViewType.SuggestedLogin && changeEmailLink() }
            </Fieldset>
        </Form>);
};

export default withLanguage(withFormik<LoginFormProps & WithLanguageProps, LoginFormValues>({
    mapPropsToValues: ({
        email = '',
    }) => ({
        email,
        password: '',
    }),
    handleSubmit: (values, { props: { onSignIn } }) => {
        onSignIn(values);
    },
    validationSchema: ({ language }: LoginFormProps & WithLanguageProps) =>
        getEmailValidationSchema({ language }).concat(object({
            password: string()
                .required(language.translate('customer.password_required_error')),
        })),
})(memo(LoginForm)));
