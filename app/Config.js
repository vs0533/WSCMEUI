/**
 * Created by byron on 2017/6/25.
 */
Ext.define("WsCme.config.Config",{
    statics:{
        apiServiceUrl:"http://192.168.0.107:58109",
        token:localStorage.getItem("token"),
        headers:{Authorization:"bearer "+ localStorage.getItem("token")}
    }
});