import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import FileUploadProgress from "react-fileupload-progress";

//REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { kycCreate, kycUpload } from "../../redux/settingsAction";

// STYLE
import style from "../../style.css";
import colors from "../../../../components/bases/colors";

// MATERIAL UI
import { Grid, Input, Select, MenuItem } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";

// UTILS
import i18n from "../../../../utils/i18n";

// ICONS
import Done from "@material-ui/icons/Done";

// COMPONENTS
import { CEP } from "../../../../components/inputMask";

const inputStyle = {
  root: {
    color: colors.messages.info,
    marginBottom: "5px",
    margin: "0",
    padding: "5px",
    width: "calc(100% - 50px)",
    "&:hover:before": {
      borderBottomColor: colors.purple.dark
    }
  },
  cssInput: {
    fontFamily: "Noto Sans, sans-serif",
    fontSize: "17px",
    letterSpacing: "0.5px"
  },
  cssUnderline: {
    "&:before, &:after": {
      borderBottomColor: colors.purple.dark
    },
    "&:hover:not($disabled):not($error):not($focused):before": {
      borderBottomColor: `${colors.purple.dark} !important`
    }
  },
  disabled: {},
  error: {},
  focused: {},
  progressWrapper: {
    height: "5px",
    width: "50px",
    float: "left",
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    borderRadius: "6px",
    WebkitBoxShadow: "inset 0 1px 2px rgba(0,0,0,.1)",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,.1)"
  },
  progressBar: {
    float: "left",
    width: "0",
    height: "100%",
    fontSize: "12px",
    lineHeight: "20px",
    color: "#fff",
    textAlign: "center",
    backgroundColor: "#65e986",
    WebkitBoxShadow: "inset 0 -1px 0 rgba(0,0,0,.15)",
    boxShadow: "inset 0 -1px 0 rgba(0,0,0,.15)",
    WebkitTransition: "width .6s ease",
    Otransition: "width .6s ease",
    transition: "width .6s ease"
  },
  cancelButton: {
    WebkitAppearance: "none",
    padding: 0,
    cursor: "pointer",
    background: "0 0",
    border: 0,
    float: "left",
    fontSize: "21px",
    fontWeight: 700,
    lineHeight: 1,
    color: "#f05252"
  },
  sendIcon: {
    float: "left",
    backgroundColor: "transparent",
    border: 0,
    color: "red"
  },
  alignForm: {
    display: "flex",
    alignItems: "center"
  },
  input: {
    width: "100%",
    backgroundColor: colors.purple.dark,
    borderRadius: "25px",
    padding: "10px"
  },
  underline: {
    width: "90%",
    "&:hover": {
      backgroundColor: colors.purple.dark
    },
    "&:before": {
      borderColor: colors.purple.dark
    },
    "&:after": {
      borderColor: colors.purple.dark
    }
  },
  underlineItems: {
    color: "white",
    borderBottomColor: `${colors.green.default} !important`,
    fontSize: "1em",
    width: "100%",
    icon: {
      fill: "green"
    }
  },
  icon: {
    fill: colors.purple.dark
  }
};
class KYC extends React.Component {
  constructor() {
    super();
    this.state = {
      enableButtonUpload: false,
      enableButtonConfirm: false,
      fullName: "",
      street: "",
      state: "",
      city: "",
      zipcode: "",
      cnpj: "",
      countryCode: "",
      areaCode: "",
      phoneNumber: "",
      selectedFile: null
    };
  }

  formGetter() {
    return new FormData(document.getElementById("customForm"));
  }

  enableButtonUpload = (value, fileType) => {
    const { kycUpload } = this.props;
    let reader = new FileReader();
    reader.readAsDataURL(this.state.selectedFile);
    reader.onload = function() {
      const payload = {
        fileType: fileType,
        file: reader.result.split(',')[1]
      };
      kycUpload(payload);
    };
    reader.onerror = function(error) {
      console.log("Error: ", error);
    };
  };

  fileUpload = e => {
    this.setState({ selectedFile: e.target.files[0] });
  };

  customFormRenderer(onSubmit, value, fileType) {
    return (
      <form id="customForm" style={inputStyle.alignForm}>
        <div style={inputStyle.input}>
          <label htmlFor="inputFile" style={{ float: "left" }}>
            <img src="images/icons/camera/camera@2x.png" alt="camera" />
          </label>
          <input
            aria-label
            style={{ display: "none" }}
            type="file"
            id="inputFile"
            onChange={this.fileUpload}
            accept=".png"
          />
          <span
            style={{ marginLeft: "15px", color: "#654fa4", fontSize: "12px" }}
          >
            {value}
          </span>
          <img
            src="images/icons/security/anexo@1x.png"
            alt="anexo"
            style={{ float: "right" }}
            onClick={() => this.enableButtonUpload(value, fileType)}
          />
        </div>
      </form>
    );
  }

  customProgressRenderer(progress, hasError, cancelHandler) {
    if (hasError || progress > -1) {
      let barStyle = Object.assign({}, inputStyle.progressBar);
      barStyle.width = progress + "%";

      let message = <span>{barStyle.width}</span>;
      if (hasError) {
        barStyle.backgroundColor = "#68f285";
        message = (
          <span style={{ color: "#f05252" }}>
            {i18n.t("TEXT_FAILED_UPLOAD")}
          </span>
        );
      }
      if (progress === 100) {
        message = (
          <div
            style={{
              display: "flex",
              color: "#68f285"
            }}
          >
            <span>
              <Done />
            </span>
          </div>
        );
      }

      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <button style={inputStyle.sendIcon}>
            <span>
              <img
                src="images/icons/security/anexo@1x.png"
                style={{ width: "12px" }}
              />
            </span>
          </button>
          <div style={inputStyle.progressWrapper}>
            <div style={barStyle} />
          </div>
          <button style={inputStyle.cancelButton} onClick={cancelHandler}>
            <span>&times;</span>
          </button>
          <div style={{ clear: "left" }}>{message}</div>
        </div>
      );
    } else {
      return;
    }
  }

  listStates = () => {
    const { classes } = this.props;
    const states = ["São Paulo", "Rio de Janeiro"];

    return states.map((item, index) => (
      <MenuItem
        value={item}
        key={index}
        classes={{
          root: classes.menuItemRoot
        }}
      >
        {item}
      </MenuItem>
    ));
  };

  handleInput = property => e => {
    this.setState({
      [property]: e.target.value
    });
  };

  handleClick = () => {
    const { kycCreate } = this.props;
    const {
      street,
      state,
      city,
      zipcode,
      fullName,
      cnpj,
      countryCode,
      areaCode,
      phoneNumber
    } = this.state;
    const payload = {
      fullName,
      cnpj,
      phone: {
        countryCode,
        areaCode,
        phoneNumber
      },
      address: {
        street,
        city,
        state,
        country: "Brasil",
        zipcode
      }
    };

    // kycCreate(payload);
  };

  render() {
    const { classes } = this.props;
    const { enableButtonConfirm } = this.state;
    const MenuProps = {
      PaperProps: {
        style: {
          color: "#fff",
          maxHeight: 40 * 4.5,
          marginTop: "45px",
          backgroundColor: "#473088",
          width: "10%"
        }
      }
    };

    return (
      <div>
        <Grid container className={style.containerHeaderSettings}>
          <Grid item xs={12} className={style.headerSettingsDefault}>
            <Hidden smUp>
              <Grid item xs={12}>
                <h3>{i18n.t("TITLE_SECURITY_3")} </h3>
              </Grid>
            </Hidden>
            <Grid item sm={2} />

            <Grid item xs={6} sm={2}>
              <Link to="security">
                <p>{i18n.t("SECURITY_LINK_RETURN")}</p>
              </Link>
            </Grid>
            <Hidden xsDown>
              <Grid item xs={12} sm={3}>
                <h3>{i18n.t("TITLE_SECURITY_3")}</h3>
              </Grid>
            </Hidden>

            <Grid item xs={10} sm={6} id={"hr"}>
              <hr />
            </Grid>
          </Grid>
        </Grid>

        <div className={style.containerSecurity}>
          <Grid item xs={11} sm={8}>
            <Grid container className={style.allSecurity}>
              <Grid item xs={12} className={style.containerItems}>
                <Grid item xs={12} className={style.counterItemsKYC}>
                  <Grid item xs={12} sm={3} className={style.columItems}>
                    <Grid className={style.indicatorItemKYC}>
                      {"1"} <p>{i18n.t("SECURITY_ITEM_1")}</p>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={3} className={style.columItems}>
                    <Grid className={style.indicatorItemKYC}>
                      {"2"} <p> {i18n.t("SECURITY_ITEM_2")} </p>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={3} className={style.columItems}>
                    <Grid className={style.indicatorItemKYC}>
                      {"3"} <p>{i18n.t("SECURITY_ITEM_3")}</p>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} className={style.containerKYC}>
                <Grid item xs={12} sm={10} className={style.wrapperKYC}>
                  <Grid container className={style.contentKYC}>
                    <Grid container className={style.boxKYC_1}>
                      <Grid item xs={12} sm={5}>
                        <p>{i18n.t("KYC_FULL_NAME")}</p>
                        <Input
                          value={this.state.fullName}
                          onChange={this.handleInput("fullName")}
                          classes={{
                            root: classes.root,
                            underline: classes.cssUnderline,
                            input: classes.cssInput
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <p>{i18n.t("KYC_DDI")}</p>
                        <Input
                          value={this.state.countryCode}
                          onChange={this.handleInput("countryCode")}
                          classes={{
                            root: classes.root,
                            underline: classes.cssUnderline,
                            input: classes.cssInput
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <p>{i18n.t("KYC_DDD")}</p>
                        <Input
                          value={this.state.areaCode}
                          onChange={this.handleInput("areaCode")}
                          classes={{
                            root: classes.root,
                            underline: classes.cssUnderline,
                            input: classes.cssInput
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <p>{i18n.t("KYC_PHONE")}</p>
                        <Input
                          value={this.state.phoneNumber}
                          onChange={this.handleInput("phoneNumber")}
                          classes={{
                            root: classes.root,
                            underline: classes.cssUnderline,
                            input: classes.cssInput
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Hidden smUp>
                          <div>
                            <img src="images/icons/security/anexo@1x.png" />
                          </div>
                        </Hidden>
                        <p>{i18n.t("SETTINGS_USER_ADDRESS")}</p>
                        <Input
                          value={this.state.street}
                          onChange={this.handleInput("street")}
                          classes={{
                            root: classes.root,
                            underline: classes.cssUnderline,
                            input: classes.cssInput
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Hidden xsDown>
                          <div>
                            <img src="images/icons/security/anexo@1x.png" />
                          </div>
                        </Hidden>
                        <p>{i18n.t("SETTINGS_USER_ZIP_CODE")}</p>

                        <Input
                          classes={{
                            root: classes.root,
                            underline: classes.cssUnderline,
                            input: classes.cssInput
                          }}
                          value={this.state.zipcode}
                          inputComponent={CEP}
                          onChange={this.handleInput("zipcode")}
                        />
                      </Grid>
                    </Grid>
                    <Grid container className={style.boxKYC_2}>
                      <Grid item xs={6} sm={6}>
                        <p>{i18n.t("SETTINGS_USER_CITY")}</p>
                        <Select
                          classes={{ selectMenu: classes.underlineItems }}
                          value={this.state.city}
                          MenuProps={MenuProps}
                          input={
                            <Input
                              classes={{
                                underline: classes.underline
                              }}
                            />
                          }
                          inputProps={{
                            classes: {
                              icon: classes.icon
                            }
                          }}
                          renderValue={value => value}
                          onChange={this.handleInput("city")}
                        >
                          {this.listStates()}
                        </Select>
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <p>{i18n.t("SETTINGS_USER_STATE")}</p>
                        <Select
                          classes={{ selectMenu: classes.underlineItems }}
                          value={this.state.state}
                          MenuProps={MenuProps}
                          input={
                            <Input
                              classes={{
                                underline: classes.underline
                              }}
                            />
                          }
                          inputProps={{
                            classes: {
                              icon: classes.icon
                            }
                          }}
                          renderValue={value => value}
                          onChange={this.handleInput("state")}
                        >
                          {this.listStates()}
                        </Select>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} lg={6} className={style.boxKYC_3}>
                      <FileUploadProgress
                        isRequired
                        id="fileupkeyload"
                        key="ex1"
                        url=""
                        onProgress={(e, request, progress) => {
                          console.warn("progress", e, request, progress);
                        }}
                        onLoad={(e, request) => {
                          console.warn("load", e, request);
                        }}
                        onError={(e, request) => {
                          console.warn("error", e, request);
                        }}
                        onAbort={(e, request) => {
                          console.warn("abort", e, request);
                        }}
                        formGetter={this.formGetter.bind(this)}
                        formRenderer={e =>
                          this.customFormRenderer(
                            e,
                            i18n.t("KYC_UPLOAD_ADDRESS"),
                            "address"
                          )
                        }
                        progressRenderer={this.customProgressRenderer.bind(
                          this
                        )}
                      />
                    </Grid>
                  </Grid>

                  <Grid item className={style.contentKYC_2}>
                    <Grid container className={style.boxKYC_2}>
                      <Grid item xs={12}>
                        <div>
                          <img src="images/icons/security/anexo@1x.png" />
                        </div>
                        <p> {i18n.t("SECURITY_INSERT_DOC")}</p>
                        <Input
                          value={this.state.cnpj}
                          onChange={this.handleInput("cnpj")}
                          classes={{
                            root: classes.root,
                            underline: classes.cssUnderline,
                            input: classes.cssInput
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item className={style.displayBox_3}>
                      <Grid item xs={12} lg={4} className={style.boxKYC_3}>
                        <FileUploadProgress
                          isRequired
                          id="fileupload"
                          key="ex1"
                          url=""
                          onProgress={(e, request, progress) => {
                            console.warn("progress", e, request, progress);
                          }}
                          onLoad={(e, request) => {
                            console.warn("load", e, request);
                          }}
                          onError={(e, request) => {
                            console.warn("error", e, request);
                          }}
                          onAbort={(e, request) => {
                            console.warn("abort", e, request);
                          }}
                          formGetter={this.formGetter.bind(this)}
                          formRenderer={e =>
                            this.customFormRenderer(
                              e,
                              i18n.t("KYC_UPLOAD_FRONT"),
                              "documentFront"
                            )
                          }
                          progressRenderer={this.customProgressRenderer.bind(
                            this
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} lg={4} className={style.boxKYC_3}>
                        <FileUploadProgress
                          isRequired
                          id="fileupload"
                          key="ex1"
                          url=""
                          onProgress={(e, request, progress) => {
                            console.warn("progress", e, request, progress);
                          }}
                          onLoad={(e, request) => {
                            console.warn("load", e, request);
                          }}
                          onError={(e, request) => {
                            console.warn("error", e, request);
                          }}
                          onAbort={(e, request) => {
                            console.warn("abort", e, request);
                          }}
                          formGetter={this.formGetter.bind(this)}
                          formRenderer={e =>
                            this.customFormRenderer(
                              e,
                              i18n.t("KYC_UPLOAD_BACK"),
                              "documentBack"
                            )
                          }
                          progressRenderer={this.customProgressRenderer.bind(
                            this
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} lg={4} className={style.boxKYC_3}>
                        <FileUploadProgress
                          isRequired
                          id="fileupload"
                          key="ex1"
                          url="http://localhost:6000/api/upload"
                          onProgress={(e, request, progress) => {
                            console.warn("progress", e, request, progress);
                          }}
                          onLoad={(e, request) => {
                            console.warn("load", e, request);
                          }}
                          onError={(e, request) => {
                            console.warn("error", e, request);
                          }}
                          onAbort={(e, request) => {
                            console.warn("abort", e, request);
                          }}
                          formGetter={this.formGetter.bind(this)}
                          formRenderer={e =>
                            this.customFormRenderer(
                              e,
                              i18n.t("KYC_UPLOAD_SELFIE"),
                              "documentSelfie"
                            )
                          }
                          progressRenderer={this.customProgressRenderer.bind(
                            this
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <center>
                      <Grid item xs={12} sm={6}>
                        {enableButtonConfirm ? (
                          <button
                            className={style.buttonEnableSecurity}
                            onClick={() => this.handleClick()}
                          >
                            {i18n.t("BTN_CONFIRM")}
                          </button>
                        ) : (
                          <button
                            className={style.buttonDisabledSecurity}
                            onClick={() => this.handleClick()}
                          >
                            {i18n.t("BTN_CONFIRM")}
                          </button>
                        )}
                      </Grid>
                    </center>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

KYC.propTypes = {
  classes: PropTypes.object.isRequired,
  kycCreate: PropTypes.func.isRequired,
  kycUpload: PropTypes.func.isRequired
};

const mapStateToProps = store => ({
  p2pStore: store.p2p
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      kycCreate,
      kycUpload
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(inputStyle)(KYC));