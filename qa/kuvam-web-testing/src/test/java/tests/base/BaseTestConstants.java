package tests.base;

public final class BaseTestConstants {

    public static final String HOME_URL =
            "http://localhost:4200/";

    public static final String FRONTEND_ORIGIN =
            "http://localhost:4200";

    public static final String BLANK_PAGE_URL =
            "about:blank";

    public static final String CLEAR_BROWSER_STORAGE_SCRIPT =
            "window.localStorage.clear(); window.sessionStorage.clear();";

    public static final String LOGOUT_SCRIPT =
            """
            const done = arguments[arguments.length - 1];

            fetch(
                'http://localhost:3000/api/v1/auth/logout',
                {
                    method: 'POST',
                    credentials: 'include'
                }
            )
            .catch(() => null)
            .finally(() => done());
            """;

    private BaseTestConstants() {
    }
}