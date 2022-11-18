import React from "react";

export const ResetMessage = () => {
  const link = `http://3.209.221.175:3000/login`;
  return (
    <div>
      <body
        style={{
          padding: "0",
          margin: 0,
          fontFamily: ":Arial",
          lineHeight: "24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "700px",
            padding: "0 15px",
            margin: "20px auto 20px auto",
            display: "table",
            boxSizing: " border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              background: "#fff",
              border: "1px solid #d7e7ee",
              padding: "15px",
              borderRadius: "10px",
            }}
          >
            <p
              style={{
                fontSize: "16px",
              }}
            >
              Your password changed Successfully.
            </p>

            <p
              style={{
                fontSize: "16px",
              }}
            >
              <span
                style={{
                  fontWeight: "600",
                }}
              >
                <a
                  style={{
                    color: "green",
                    textDecoration: "underlineF",
                  }}
                  href={link}
                >
                  Click Here
                </a>
                to login with your password.
              </span>
            </p>
          </div>
        </div>
      </body>
    </div>
  );
};
