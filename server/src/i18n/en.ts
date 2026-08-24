/**
 * I18n dictionary for the en.
 */

const en = {
  app: {
    title: 'Nowspeed',
  },

  validation: {

    noPendingRecord: 'No pending record found',
    inValidWithdrawPassword: 'Your withdraw Password is not correct please check again',
    exceedsBalance: 'It looks like your withdrawal amount exceeds your balance',
    missingWalletAddress: 'Please go to the "Wallet" section to bind your USDT (TRC20) or ERC20 address before submitting a withdrawal request.',
    requiredAmount: 'Please write amount',
    notFoundTransaction: 'Transaction not found',
    permissoin: "Please try to contact the customer Support for help",
    duplicateSubsctription: 'You have already subscribed to this plan',
    InsufficientBalance: 'Insufficient balance',
    requiredSubscription: 'Please select a subscription plan',
    moretasks: 'This is your limit. Please contact customer support for more tasks',
    deposit:"Insufficient balance please contact the customer support",
    submitPendingProducts:"Please, submit the pending products ",
    noSequenceAssigned: "No task sequence has been assigned to your account yet. Please contact customer support.",
    noVipForBalance: "No VIP level covers your current balance. Please contact customer support.",
    noProductsAvailable: "No product is available for this task. Please contact customer support.",
  },


  auth: {
    userNotFound: `Sorry, we don't recognize your credentials`,
    wrongPassword: `Sorry, we don't recognize your credentials`,
    weakPassword: 'This password is too weak',
    emailAlreadyInUse: 'Username is already in use',
    invitationCode: 'please write a correct invitationCode',
    invalidEmail: 'Please provide a valid email',
    passwordReset: {
      invalidToken:
        'Password reset link is invalid or has expired',
      error: `Email not recognized`,
    },
    emailAddressVerificationEmail: {
      invalidToken:
        'Email verification link is invalid or has expired.',
      error: `Email not recognized.`,
      signedInAsWrongUser: `This email confirmation was sent to {0} but you're signed in as {1}.`,
    },
    passwordChange: {
      invalidPassword: 'The old password is invalid',
    },
  },

  user: {
    errors: {
      userAlreadyExists:
        'User with this email already exists.',
      userNotFound: 'User not found.',
      destroyingHimself: `You can't delete yourself.`,
      revokingOwnPermission: `You can't revoke your own admin permission.`,
      revokingPlanUser: `You can't revoke the admin permission of the plan manager.`,
      destroyingPlanUser: `You can't delete the plan manager.`,
    },
  },

  tenant: {
    exists:
      'There is already a workspace on this application.',
    url: {
      exists: 'This workspace URL is already in use.',
    },
    invitation: {
      notSameEmail: `This invitation was sent to {0} but you're signed in as {1}.`,
    },
    planActive: `There is a plan active for this workspace. Please cancel the plan first.`,
    stripeNotConfigured: 'Stripe is not configured.',
  },

  importer: {
    errors: {
      invalidFileEmpty: 'The file is empty',
      invalidFileExcel:
        'Only excel (.xlsx) files are allowed',
      invalidFileUpload:
        'Invalid file. Make sure you are using the last version of the template.',
      importHashRequired: 'Import hash is required',
      importHashExistent: 'Data has already been imported',
    },
  },

  errors: {
    notFound: {
      message: 'Not Found',
    },
    forbidden: {
      message: 'Forbidden',
    },
    validation: {
      message: 'An error occurred',
    },
  },

  email: {
    error: `Email provider is not configured.`,
  },

  preview: {
    error:
      'Sorry, this operation is not allowed in preview mode.',
  },


};

export default en;
