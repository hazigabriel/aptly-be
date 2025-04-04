const verificationEmail = (link: string) => ({
    subject: "Almost There! Verify Your Email",
    body: `
      Hey there!<br><br>
      Thanks for signing up with Aptly! To get started, just click the link below to verify your email:<br><br>
      <a href="${link}">Verify your email</a><br><br>
      If this wasn't you, just ignore this email and we'll leave you alone!<br><br>
      Cheers,<br>
      The Aptly Team
    `,
})

const expiredVerificationEmail = (link: string) => ({
    subject: "Your Verification Link Expired - New One Inside!",
    body: `
      Hey there!<br><br>
      Looks like your email verification link has expired. Don't worry—it's easy to fix!<br><br>
      Simply click the link below to verify your email and complete your registration:<br><br>
      <a href="${link}">Verify your email</a><br><br>
      If this wasn't you, just ignore this email.<br><br>
      Thanks for using Aptly,<br>
      The Aptly Team
    `,
})

const forgotPasswordEmail = (link: string) => ({
    subject: "Reset Your Password - Aptly",
    body: `
    Hey there!<br><br>
    We received a request to reset your password. If this was you, click the link below to set a new password:<br><br>
    <a href="${link}">Reset your password</a><br><br>
    This link will expire in 1 hour for security reasons.<br><br>
    If you didn't request a password reset, you can safely ignore this email.<br><br>
    Stay secure,<br>
    The Aptly Team
  `,
})

export { verificationEmail, expiredVerificationEmail, forgotPasswordEmail }
