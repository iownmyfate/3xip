import { CONFIG_KEYS } from '../configuration.constants';

export type MongoDBConfigType = {
  uri: string;
};

export const buildMongoDBConfig = (
  configKeymap = CONFIG_KEYS.KEYMAPS.MONGODB,
  configPrefix = CONFIG_KEYS.PREFIXES.MONGODB,
  configKeys = null,
) => {
  let keys: { [x in keyof MongoDBConfigType]: string } = {
    uri: 'URI',
  };

  if (configPrefix != '') {
    for (const key in keys) {
      keys[key] = `${configPrefix}_${keys[key]}`;
    }
  }

  if (configKeys != null) {
    keys = configKeys;
  }

  const config = {};
  config[configKeymap] = {
    uri: process.env[keys.uri],
  };

  return config;
};
