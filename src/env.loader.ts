export const EnvLoader = {
  get(key: string): string | undefined {
    return process.env[key];
  },

  getWithDefault(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
  },
};
