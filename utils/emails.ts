export async function sendInvitationEmail(user: User) {
  const inviteToken = await generateInviteToken(user.id);
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/activate?token=${inviteToken}`;

  // Send email using your email service
  await sendEmail({
    to: user.email,
    subject: 'Welcome to Senator Safety SHIELD',
    template: 'user-invitation',
    variables: {
      username: user.username,
      inviteUrl,
      role: user.role,
      subscriptionTier: user.subscriptionTier
    }
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: 'Reset Your Password',
    template: 'password-reset',
    variables: {
      resetUrl,
      expiryTime: '24 hours'
    }
  });
}