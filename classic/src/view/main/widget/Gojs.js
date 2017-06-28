Ext.define('WsCme.view.main.widget.Gojs', {

    extend : 'Ext.panel.Panel',
    title : '业务模块图',

    iconCls : 'fa fa-star',

    listeners : {
        render : function(panel) {
            panel.drawHierarchy();
        }
    },
    layout : 'fit',
    items : [ {
        xtype : 'container',
        id : 'myDiagramDiv'
    } ],

    drawHierarchy : function() {

        var modules, moduleshierarchy;
        // 从后台取得用户模块的Ajax请求
        Ext.Ajax.request({
            url : 'modulehierarchy/allmodule.do',
            async : false,
            success : function(response) {
                modules = Ext.decode(response.responseText, true)
            }
        });
        // 从后台取得用户模块关联关系的Ajax请求
        Ext.Ajax.request({
            url : 'modulehierarchy/allmodulehierarchy.do',
            async : false,
            success : function(response) {
                moduleshierarchy = Ext.decode(response.responseText, true)
            }
        });

        var $ = go.GraphObject.make;
        this.$ = $;
        var diagram = $(go.Diagram, "myDiagramDiv", {
            initialContentAlignment : go.Spot.Center, // center Diagram contents
            "undoManager.isEnabled" : true,
            // enable Ctrl-Z to undo and Ctrl-Y to redo
            scale : .8,
            doubleClick : function() {
                console.log('doubleClick');
            },
            layout : $(go.TreeLayout, { // this only lays out in trees nodes
                // connected by
                // "generalization" links
                angle : 270,
                path : go.TreeLayout.PathSource, // links go from child to parent
                setsPortSpot : false, // keep Spot.AllSides for link connection
                // spot
                setsChildPortSpot : false, // keep Spot.AllSides
                // nodes not connected by "generalization" links are laid out
                // horizontally
                arrangement : go.TreeLayout.ArrangementHorizontal
            })

        });
        this.diagram = diagram;
        diagram.nodeTemplate = $(go.Node, "Auto", $(go.Shape, {
            fill : $(go.Brush, go.Brush.Linear, {
                0 : "white",
                1 : "lightblue"
            }),
            stroke : "darkblue",
            strokeWidth : 1
        }), $(go.Panel, "Table", {
                defaultAlignment : go.Spot.Left,
                margin : 4
            }, $(go.RowColumnDefinition, {
                column : 1,
                width : 4
            }),

            $(go.TextBlock, {
                row : 0,
                column : 0,
                columnSpan : 3,
                alignment : go.Spot.Center
            }, {
                font : "bold 12pt sans-serif"
            }, new go.Binding("text", "title"), new go.Binding("stroke", "color")),

            $(go.TextBlock, "模块名称: ", {
                row : 1,
                column : 0
            }), $(go.TextBlock, {
                row : 1,
                column : 2
            }, new go.Binding("text", "moduleName"))));

        diagram.model = new go.GraphLinksModel(modules, moduleshierarchy);

    }

})
