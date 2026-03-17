import { PreferenceModel } from "../models/Preference.js";

export type ChannelPrefs = {
  email: boolean;
  sms: boolean;
  push: boolean;
  inapp: boolean;
};

export async function getChannelPreferences(
  userId: string,
  notificationType: string
): Promise<ChannelPrefs> {
  const pref = await PreferenceModel.findOne({ userId, notificationType }).lean();
  if (!pref) {
    return { email: true, sms: false, push: true, inapp: true };
  }
  return {
    email: pref.emailEnabled,
    sms: pref.smsEnabled,
    push: pref.pushEnabled,
    inapp: pref.inAppEnabled,
  };
}

