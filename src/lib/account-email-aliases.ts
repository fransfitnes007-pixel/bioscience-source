const SIGN_IN_EMAIL_ALIASES: Record<string, string> = {
  "admin.fran@resurrectedhq.com": "admin.fran@resurrectedlabz.com",
  "client.fran@resurrectedhq.com": "client.fran@resurrectedlabz.com",
  "customer.fran@resurrectedhq.com": "customer.fran@resurrectedlabz.com",
};

export const normalizeSignInEmail = (value: string) => {
  const email = value.trim().toLowerCase();
  return SIGN_IN_EMAIL_ALIASES[email] ?? email;
};