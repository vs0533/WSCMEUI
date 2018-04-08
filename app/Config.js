/**
 * Created by byron on 2017/6/25.
 */
Ext.define("WsCme.config.Config",{
    statics:{
        apiServiceUrl:"http://localhost:6000",
        token:localStorage.getItem("token"),
        headers:{Authorization:"bearer "+ localStorage.getItem("token")}
    }
});