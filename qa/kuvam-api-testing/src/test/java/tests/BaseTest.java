package tests;

import com.rajcic.config.ConfigReader;
import io.restassured.RestAssured;
import org.testng.annotations.BeforeSuite;

public class BaseTest {

    @BeforeSuite
    public void before() {
        RestAssured.baseURI = ConfigReader.get("baseUri");
    }
}