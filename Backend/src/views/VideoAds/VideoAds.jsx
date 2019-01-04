import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Table from "components/Table/Table.jsx"
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import { Line, Pie } from "react-chartjs-2";
import TronWeb from 'tronweb';

import {
  dashboardNASDAQChart,
  dashboardEmailStatisticsChart
} from "variables/charts.jsx";

import contracts from '../../contracts/CrazyPinyin';
//const contractJson = contracts['CrazyPinyin.sol:TRXMessages'];

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

class VideoAds extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          tronWeb: {
              installed: false,
              loggedIn: false
          },
          contract: null,
          tableData: [],
          piechartLabel: [],
          piechartData: [],
          piechartColor: [],
          piechartFinaldata: {
            data: canvas => {
              return {
                labels: [],
                datasets: [
                  {
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    backgroundColor: [],
                    borderWidth: 0,
                    data: []
                  }
                ]
              };
            },
            options: {
              legend: {
                display: true
              },
              pieceLabel: {
                render: "percentage",
                fontColor: ["white"],
                precision: 2
              },
              tooltips: {
                enabled: true
              },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      display: false
                    },
                    gridLines: {
                      drawBorder: false,
                      zeroLineColor: "transparent",
                      color: "rgba(255,255,255,0.05)"
                    }
                  }
                ],
          
                xAxes: [
                  {
                    barPercentage: 1.6,
                    gridLines: {
                      drawBorder: false,
                      color: "rgba(255,255,255,0.1)",
                      zeroLineColor: "transparent"
                    },
                    ticks: {
                      display: false
                    }
                  }
                ]
              }
            }
          },
          infoIndex: 0,
          totalVideoAds: 0,
          tronWebAvalabilityTitle: "需要 TronLink",
          tronWebAvalabilityText: "要查看广告数据，您必须安装TronLink。TronLink是可以从Chrome浏览器的TRON钱包。安装后，返回并刷新页面。"
      }
  }

  handlePurchaseBottonClicked = () => {
    console.log("#### RINIMEI: " + window.tronWeb.defaultAddress.base58);
    this.buyVideoAds();
  };

  retrieveTronWebInfo() {
      this.setState({contract: window.tronWeb.contract(contracts.abi, contracts.address)});
  }

  startSmartContractEventListener() {
      if (!this.state.tronWeb.loggedIn) {
          return;
      }

      if (null == this.state.contract) {
          this.retrieveTronWebInfo();
      }

      console.log('### 111 hahah ');
      this.state.contract.BuyVideoAdsCompeteEvent().watch((err, response) => {
          console.log('### 111 BuyVideoAdsCompeteEvent ' + JSON.stringify(response));
          if (!err) {
              var result = response.result;
              console.log('### FKFKFKFK!!! BuyVideoAdsCompeteEvent ' + result.owner + " num: " + result.numVideoAdsToBuy);
          } else {
              return console.log("### startEventListener BuyVideoAdsCompeteEvent", JSON.stringify(err));
          }
      });
  }

  getVideoAdsInfo() {
    console.log("### TEST AAA")
    if (!this.state.tronWeb.loggedIn) {
        return;
    }

    console.log("### TEST BBBZ")
    if (null == this.state.contract) {
        this.retrieveTronWebInfo();
    }

    console.log("### TEST CCC")
    this.state.contract.getTotalNumVideoAds().call((err, result) => {
        if (!err) {
            console.log("### getTotalNumVideoAds: " + result);
            this.setState({infoIndex: 0, totalVideoAds: result});
            if (result > 0) {
                this.doGetVideoAdsInfo();
            }

        } else {
            console.error("### getTotalNumVideoAds FAILED: " + JSON.stringify(err));
        }
    });
  }

  doGetVideoAdsInfo() {
    console.log("### TEST AAA");
      this.state.contract.getVideoAdsInfo(this.state.infoIndex).call((err, result) => {
          if (!err) {
              console.log("### getVideoAdsInfo: " + result[0] + " 2: " + result[1] + " 3: " + result[2] + " 4: " + result[3] + " 5: " + result[4]);
              
              var data = [];
              data.push(result[0].toString());
              data.push(result[1].toString());
              data.push(result[2].toString());
              data.push(result[3].toString());
              data.push(result[4].toString());
              var td = this.state.tableData;
              td.push(data);

              var pl = this.state.piechartLabel;
              pl.push(result[3].toString() + "_" + result[4].toString());

              var pn = this.state.piechartData;
              pn.push(result[1]);

              var pc = this.state.piechartColor;
              pc.push(this.getRandomPiechartColor());

              var num = this.state.infoIndex + 1;
              if (num < this.state.totalVideoAds) {                
                this.setState({tableData: td, piechartLabel: pl, piechartData: pn, piechartColor: pc, infoIndex: num});
                this.doGetVideoAdsInfo();
              } else {
                  var finalData = {
                    data: canvas => {
                      return {
                        labels: pl,
                        datasets: [
                          {
                            pointRadius: 0,
                            pointHoverRadius: 0,
                            backgroundColor: pc,
                            borderWidth: 0,
                            data: [3, 4]
                          }
                        ]
                      };
                    },
                    options: {
                      legend: {
                        display: true
                      },
                      pieceLabel: {
                        render: "percentage",
                        fontColor: ["white"],
                        precision: 2
                      },
                      tooltips: {
                        enabled: true
                      },
                      scales: {
                        yAxes: [
                          {
                            ticks: {
                              display: false
                            },
                            gridLines: {
                              drawBorder: false,
                              zeroLineColor: "transparent",
                              color: "rgba(255,255,255,0.05)"
                            }
                          }
                        ],
                  
                        xAxes: [
                          {
                            barPercentage: 1.6,
                            gridLines: {
                              drawBorder: false,
                              color: "rgba(255,255,255,0.1)",
                              zeroLineColor: "transparent"
                            },
                            ticks: {
                              display: false
                            }
                          }
                        ]
                      }
                    }
                  };
                  this.setState({piechartFinaldata: finalData})
              }


          } else {
              console.error("### getVideoAdsInfo FAILED: " + JSON.stringify(err));
        }
      });
  }

  buyVideoAds() {
      var platform = document.getElementById('video-ad-platform').value;
      var ci = document.getElementById('video-ad-id').value;
      var cpcv = document.getElementById('video-ad-cpcv').value * 1000000;
      var total = document.getElementById('video-ad-total-money').value * 1000000;
      
      console.log("### getVideoAdsInfo FAILED: " + platform + " ci:" +ci + " cpcv: " + cpcv);

      this.state.contract.buyVideoAds(platform, ci, cpcv).send({shouldPollResponse: true, callValue: total}, (err, result) => {
          if (err) {
              var errString = JSON.stringify(err);
              console.log("############## buyVideoAds Failed : " + errString);
          } else {
              console.log("############## buyVideoAds OK : " + result);
          }
      });
  }

  getRandomPiechartColor() {
      var colors = ["#e3e3e3", "#4acccd", "#fcc468", "#ef8157"]
      var random = this.getRandomNum(0, 3);
      return colors[random];
  }
  
  getRandomNum(Min, Max) {
      var range = Max - Min;   
      var rand = Math.random();   
      return(Min + Math.round(rand * range));   
  } 

  async componentDidMount() {
      await new Promise(resolve => {
          const tronWebState = {
              installed: !!window.tronWeb,
              loggedIn: window.tronWeb && window.tronWeb.ready
          };

          if(tronWebState.installed) {
              this.setState({
                  tronWeb:
                  tronWebState
              });

              return resolve();
          }

          let tries = 0;

          const timer = setInterval(() => {
              if(tries >= 10) {
                  const TRONGRID_API = 'https://api.trongrid.io';

                  window.tronWeb = new TronWeb(
                      TRONGRID_API,
                      TRONGRID_API,
                      TRONGRID_API
                  );

                  this.setState({
                      tronWeb: {
                          installed: false,
                          loggedIn: false
                      }
                  });

                  clearInterval(timer);
                  return resolve();
              }

              tronWebState.installed = !!window.tronWeb;
              tronWebState.loggedIn = window.tronWeb && window.tronWeb.ready;

              if(!tronWebState.installed)
                  return tries++;

              this.setState({
                  tronWeb: tronWebState
              });

              resolve();
          }, 100);
      });

      if(this.state.tronWeb.loggedIn) {
          this.setState({
            tronWebAvalabilityTitle: "TronLink 已经登录",
            tronWebAvalabilityText: "钱包地址: " + window.tronWeb.defaultAddress.base58
          });
      } else {
          window.tronWeb.on('addressChanged', () => {
              if(this.state.tronWeb.loggedIn)
                  return;

              this.setState({
                  tronWeb: {
                      installed: true,
                      loggedIn: true
                  },
                  tronWebAvalabilityTitle: "TronLink 已经登录",
                  tronWebAvalabilityText: "钱包地址: " + window.tronWeb.defaultAddress.base58
              });
              this.startSmartContractEventListener();
              this.getVideoAdsInfo();
          });
      }

  /*
      this.timer = setTimeout(() => {
        if (!this.isTronLinkInstalled()) {
          //alert("请使用 Chrome 并安装 TronLink/TronPay 查看数据");
        } else if (!this.isTronLinkLoggedIn()) {
          //alert("请登录 TronLink/TronPay 查看数据");
        } else {
            this.setState({
              tronWebAvalabilityTitle: "TronLink 已经登录",
              tronWebAvalabilityText: "钱包地址: " + window.tronWeb.defaultAddress.base58});
        }
      }, 500);
      */
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardBody>
                <li><a href="https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec">{this.state.tronWebAvalabilityTitle}</a></li><h6>{this.state.tronWebAvalabilityText}</h6>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>信息汇总</h4>
                <p className={classes.cardCategoryWhite}>智能合约读取</p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={["广告平台", "广告 ID", "购买次数", "已经播放次数", "每次播放成本(trx)"]}
                  tableData={this.state.tableData}
                />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>购买广告</h4>
                <p className={classes.cardCategoryWhite}>智能合约调用</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="广告平台 (填写 youtube 或 qq)"
                      id="video-ad-platform"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        default: "youtube",
                        placeholder: "youtube"
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="广告 ID"
                      id="video-ad-id"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text"
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="每次播放成本(trx)"
                      id="video-ad-cpcv"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="总共投入(trx)"
                      id="video-ad-total-money"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="primary" onClick={this.handlePurchaseBottonClicked}>购买</Button>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
                <Card>
                  <CardHeader plain color="primary">
                    <h4 className={classes.cardTitleWhite}>广告播放占比</h4>
                    <p className={classes.cardCategoryWhite}>智能合约读取</p>
                  </CardHeader>
                  <CardBody>
                      <Pie
                        data={this.state.piechartFinaldata.data}
                        options={this.state.piechartFinaldata.options}
                        //data={dashboardEmailStatisticsChart.data}
                        //options={dashboardEmailStatisticsChart.options}
                      />
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(styles)(VideoAds);
