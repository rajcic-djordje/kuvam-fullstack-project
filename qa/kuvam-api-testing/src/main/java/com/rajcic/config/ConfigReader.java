package com.rajcic.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class ConfigReader {

    private static final Properties properties = new Properties();


    static {

        try (InputStream inputStream = ConfigReader.class
                .getClassLoader().getResourceAsStream("config.properties")){
            if(inputStream == null)
                throw new RuntimeException("config.properties not found");

            properties.load(inputStream);
        }

        catch (IOException e) {
            throw new RuntimeException("Failed to load properties", e);
        }
    }

    public static String get(String key) {
        return properties.getProperty(key);
    }
}
