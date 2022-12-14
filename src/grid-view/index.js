
import * as DataHelper from '../js/mock-data.js';
// creates a global "addWheelListener" method
// example: addWheelListener( elem, function( e ) { console.log( e.deltaY ); e.preventDefault(); } );
(function(window,document) {

    var prefix = "", _addEventListener, onwheel, support;

    // detect event model
    if ( window.addEventListener ) {
        _addEventListener = "addEventListener";
    } else {
        _addEventListener = "attachEvent";
        prefix = "on";
    }

    // detect available wheel event
    support = "onwheel" in document.createElement("div") ? "wheel" : // 各个厂商的高版本浏览器都支持"wheel"
              document.onmousewheel !== undefined ? "mousewheel" : // Webkit 和 IE 一定支持"mousewheel"
              "DOMMouseScroll"; // 低版本 firefox

    window.addWheelListener = function( elem, callback, useCapture ) {
        _addWheelListener( elem, support, callback, useCapture );

        // handle MozMousePixelScroll in older Firefox
        if( support == "DOMMouseScroll" ) {
            _addWheelListener( elem, "MozMousePixelScroll", callback, useCapture );
        }
    };

    function _addWheelListener( elem, eventName, callback, useCapture ) {
        elem[ _addEventListener ]( prefix + eventName, support == "wheel" ? callback : function( originalEvent ) {
            !originalEvent && ( originalEvent = window.event );

            // create a normalized event object
            var event = {
                // keep a ref to the original event object
                originalEvent: originalEvent,
                target: originalEvent.target || originalEvent.srcElement,
                type: "wheel",
                deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
                deltaX: 0,
                deltaZ: 0,
                preventDefault: function() {
                    originalEvent.preventDefault ?
                        originalEvent.preventDefault() :
                        originalEvent.returnValue = false;
                }
            };

            // calculate deltaY (and deltaX) according to the event
            if ( support == "mousewheel" ) {
                event.deltaY = - 1/40 * originalEvent.wheelDelta;
                // Webkit also support wheelDeltaX
                originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
            } else {
                event.deltaY = originalEvent.detail;
            }

            // it's time to fire the callback
            return callback( event );

        }, useCapture || false );
    }

})(window,document);



function getColumns() {
    const cols = [
        { field: 'id', width: 100, title: 'ID' },
        { field: 'name', width: 140, title: '姓名' },
        { field: 'sex', width: 70, title: '性别' },
        { field: 'birthday', width: 160, title: '出生日期' },
        { field: 'addr', width: 300, title: '地址' },
        {
            field: 'longText', title: '工作简历', width: 400
        },
        { field: 'nianxin', width: 140, title: '期望薪资' },
        { field: 'marry', width: 70, title: '婚否' },
        { field: 'zhiwei', width: 100, title: '应聘职位', fixed: 'right', right: 240 },
        { field: 'zip', width: 100, title: '邮编' , fixed: 'right', right: 140},
        { field: 'avatar', width: 140, title: '头像', fixed: 'right', right: 0}
    ];
    return cols;
}


function renderGridHeader(hasScrollY) {
    const cols = getColumns();

    const gvConvas =  document.querySelector('.grid-view_header-row');
    if (gvConvas) {
        gvConvas.remove();
    }


    const headerRowDiv = document.createElement('div');
    headerRowDiv.classList.add('grid-view_header-row');

    const totalWidth = DataHelper.getColumnsWidthTotal(cols);
    headerRowDiv.style.width = `${totalWidth}px`;


    const chkboxDiv = document.createElement('div');
    chkboxDiv.classList.add('grid-view_header-cell','grid-view_header-checkbox', 'grid-view-fixed-col');
    chkboxDiv.style.width = `40px`;
    chkboxDiv.style.left = `0px`;
    chkboxDiv.innerHTML = '<input type="checkbox" />';
    headerRowDiv.appendChild(chkboxDiv);


    const lineNumDiv = document.createElement('div');
    lineNumDiv.classList.add(...['grid-view_header-cell','grid-view_header-linenumber', 'grid-view-fixed-col']);
    lineNumDiv.style.width = `40px`;
    lineNumDiv.style.left = `40px`;
    lineNumDiv.innerText = '序号';
    headerRowDiv.appendChild(lineNumDiv);

    cols.forEach(col => {
        const headerCellDiv = document.createElement('div');
        headerCellDiv.classList.add('grid-view_header-cell');
        headerCellDiv.style.width = `${col.width || 100}px`;
        headerCellDiv.innerText = col.title;

        if (col.fixed == 'right') {
            headerCellDiv.style.right = `${col.right + (hasScrollY ? DataHelper.scrollYWidth: 0) }px`;
            headerCellDiv.classList.add('grid-view-fixed-col-right');
        }

        headerRowDiv.appendChild(headerCellDiv);
    });

    return headerRowDiv;
}

export function run(datalength = 50) {
    
    const header = document.querySelector('#gridViewHeader');
    const gridViewbody = document.querySelector('#gridViewbody');
    const gridViewFooter = document.querySelector('#gridViewFooter');
    const cols = getColumns();
    
    const data = DataHelper.createData(datalength);
    gridViewbody.appendChild(DataHelper.renderGridRows(data, cols, {
        showCheckbox: true, showRowNumber: true
    }));

    setTimeout(() => {
        const colElements = renderGridHeader(gridViewbody.scrollHeight > gridViewbody.clientHeight);
        header.appendChild(colElements);
        if (gridViewbody.scrollHeight > gridViewbody.clientHeight) {
            colElements.style.width =  `${DataHelper.getColumnsWidthTotal(cols) + DataHelper.scrollYWidth}px`;
            
        }
    });

    gridViewbody.addEventListener('scroll', (e) => {
        // console.log(e);
        header.scrollLeft = gridViewbody.scrollLeft;
        gridViewFooter.scrollLeft = gridViewbody.scrollLeft;
    });
}

export function start() {
    const header = document.querySelector('#gridViewHeader');
    const gridViewbody = document.querySelector('#gridViewbody');
    const gridViewFooter = document.querySelector('#gridViewFooter');
    
    gridViewbody.addEventListener('scroll', (e) => {
        // console.log(e);
        header.scrollLeft = gridViewbody.scrollLeft;
        gridViewFooter.scrollLeft = gridViewbody.scrollLeft;
    });

}

