import * as utils from './helper.js';
import * as DataHelper from './js/mock-data.js';

const columns = [
    [
        { id:'basic_info', title: '基本信息', colspan: 5, halign: 'center'},
        { id:'addr', field: 'addr', width: 270, title: '地址', halign: 'center', rowspan: 3 },
        { id:'other_info', title: '其他信息', colspan: 3, halign: 'center'},
    ],
    [
        { id:'id', field: 'id', width: 40, title: 'ID', halign: 'center', align: 'center', rowspan: 2, parentId: 'basic_info' },
        { id: 'name',field: 'name', width: 130, title: '姓名' , rowspan: 2, parentId: 'basic_info'},
        { id: 'sex',field: 'sex', width: 70, title: '性别', halign: 'center', align: 'center', rowspan: 2, parentId: 'basic_info'
        },
        { id: 'birthday', field: 'birthday', width: 120, title: '出生日期', rowspan: 2 , parentId: 'basic_info'},
        { id: 'marry', field: 'marry', width: 70, title: '婚否', halign: 'center', align: 'center', rowspan: 2, parentId: 'basic_info' },

        { id: 'xzzj', title: '薪资职级', colspan: 2, halign: 'center', parentId: 'other_info'},
        { id: 'zip', field: 'zip', width: 100, title: '邮编' , rowspan: 2, parentId: 'other_info'}
    ],
    [
        { id: 'nianxin', field: 'nianxin', width: 140, title: '年薪', halign: 'right', align: 'right',  parentId: 'xzzj' },
        { id: 'zhiwei', field: 'zhiwei', width: 100, title: '职位', parentId: 'xzzj' },
    ]
];


function createGroupHeader(fixed) {

    const gvConvas =  document.querySelector('.grid-view_header-row');
    if (gvConvas) {
        gvConvas.remove();
    }

    const headerRowDiv = document.createElement('div');
    headerRowDiv.classList.add('grid-view_header-row'); 

    const headerHeight = columns.length * 36;
    headerRowDiv.style.height = `${headerHeight}px`;

    const chkboxDiv = document.createElement('div');
    if (fixed){
        chkboxDiv.classList.add('grid-view_header-cell','grid-view_header-checkbox', 'grid-view-fixed-col');
    } else {
        chkboxDiv.classList.add('grid-view_header-cell','grid-view_header-checkbox');
    }
    chkboxDiv.style.width = `40px`;
    chkboxDiv.style.left = `0px`;
    chkboxDiv.style.height = `${headerHeight}px`;
    chkboxDiv.innerHTML = '<input type="checkbox" />';
    headerRowDiv.appendChild(chkboxDiv);


    const lineNumDiv = document.createElement('div');
    if (fixed) {
        lineNumDiv.classList.add(...['grid-view_header-cell','grid-view_header-linenumber', 'grid-view-fixed-col']);
    } else {
        lineNumDiv.classList.add(...['grid-view_header-cell','grid-view_header-linenumber']);
    }
    lineNumDiv.style.width = `40px`;
    lineNumDiv.style.left = `40px`;
    lineNumDiv.style.height = `${headerHeight}px`;
    lineNumDiv.innerText = '序号';
    headerRowDiv.appendChild(lineNumDiv);


    columns.forEach(cols => {
        cols.forEach(col => {
            const headerCellDiv = document.createElement('div');
            headerCellDiv.classList.add('grid-view_header-cell');
            headerCellDiv.style.width = `${col.width || 100}px`;
            headerCellDiv.innerText = col.title;
            headerCellDiv.style.top = `${col.top}px`;
            headerCellDiv.style.left = `${col.left + 80}px`;
            headerCellDiv.style.height = `${col.height}px`;
            

            headerRowDiv.appendChild(headerCellDiv);
        });
    });

    return headerRowDiv;
}


export function run(datalength = 50) {
    
    const header = document.querySelector('#gridViewHeader');
    const gridViewbody = document.querySelector('#gridViewbody');

    const dataColumns = calculationGroupColumnWidth();
    
    const data = DataHelper.createData(datalength);
    gridViewbody.appendChild(DataHelper.renderGridRows(data, dataColumns, {
        showCheckbox: true, showRowNumber: true, fixed: true
    }));

    setTimeout(() => {
        const colElements = createGroupHeader(true);
        header.appendChild(colElements);
        if (gridViewbody.scrollHeight > gridViewbody.clientHeight) {
            colElements.style.width =  `${DataHelper.getColumnsWidthTotal(dataColumns) + DataHelper.scrollYWidth}px`;
        }
    });

    gridViewbody.addEventListener('scroll', (e) => {
        // console.log(e);
        header.scrollLeft = gridViewbody.scrollLeft;
    });
}


// 计算分组表头宽度
function calculationGroupColumnWidth() {
    columns.forEach((cols, i) => {
        cols.forEach(col => {
            if (!col.colspan) {
                col.colspan = 1;
            }

            if (!col.rowspan) {
                col.rowspan = 1;
            }
        });
    });

    columns.forEach((cols, i) => {
        cols.forEach(col => {
            if (col.colspan >1) {
                col.width = columns[i + 1].filter(n => n.parentId === col.id).reduce((r, c) => {
                    r += (c.width || 100);
                    return r;
                }, 0)
            }

            if (col.rowspan > 1) {
                col.height = col.rowspan * 36;
            }

            col.top = i * 36;
        });
    });

    const _columns_ = getDataColumns(utils.deepClone(columns));

    columns.forEach((cols, i) => {
        cols.forEach(col => {
            if (col.colspan >1) {
                col.width = columns[i + 1].filter(n => n.parentId === col.id).reduce((r, c) => {
                    r += (c.width || 100);
                    return r;
                }, 0);

                // col.left = _columns_.filter(n => n.parentId === col.id)[0].left;
            } else {
                col.left = _columns_.find(n => n.field === col.field).left;
            }

            if (col.rowspan > 1) {
                col.height = col.rowspan * 36;
            }

            col.top = i * 36;
        });
    });

    setGroupColumnSize(_columns_);
    console.log(_columns_, columns);

    return _columns_;
}

function setGroupColumnSize(dataColumns) {
    var i = columns.length - 1;
    while(i >= 0) {
        var ids = columns[i].map(n => n.parentId);
        ids = Array.from(new Set(ids));
        ids.map(id => {
            const childCols = columns[i].filter(n => n.parentId == id).map(n => {
                const dataField = dataColumns.find(c => c.id === n.id);
                return dataField || n;
            });
            return { 
                id,
                width: childCols.reduce((r,c) => { return r+=c.width }, 0),
                left: childCols[0].left,
                right: childCols[childCols.length - 1].right || 0
            };
        }).forEach(p => {
            if (i - 1 >= 0) {
                let pCol = columns[i-1].find(pc => pc.id == p.id);
                const dataField = dataColumns.find(c => c.id === p.id);
                pCol = dataField || pCol;

                // pCol.width = p.width;
                pCol.left = p.left;
                pCol.right = p.right;
                // if (pCol.fixed === 'left') {
                //     pCol.left = p.left;
                // }
                // if (pCol.fixed === 'right') {
                //     pCol.right = p.right;
                // }
            }
        });
        i--;
    }
}


function getDataColumns(columns) {
    let _columns = [];
    if (columns && columns.length) {
        _columns = _getDataColumns(columns);

        if (_columns && _columns.length) {
            _columns.forEach((n, i) => {
                if (i) {
                    n.left = _columns.slice(0, i).reduce((r, c) => {
                        r+=c.width;
                        return r;
                    }, 0)
                } else {
                    n.left = 0;
                }
            });

            Array.from(new Set(_columns.map(n => n.parentId))).forEach(n => {
                
            });
        }

    }
    return  _columns;
}



function _getDataColumns(cols) {
    if (!cols || !cols.length) {
        return [];
    }

    const getDataFields = (cols, length) => {
        let i = 0;
        let j = 0;
        cols.forEach(n => {
            const colspan = n.colspan || 1;
            if (i + colspan <= length) {
                i += colspan;
                j++;
            }
        });
        return cols.splice(0, j);
    }


    let fields = [];
    for (let i = 0; i < cols.length; i++) {
        let _cols = cols[i];
        if (cols[i] && !cols[i].length) {
            _cols = [...fields];
            fields = [];
        }
        _cols.forEach(n => {
            if (!n.field && n.colspan && n.colspan > 1) {

                // if (n['halign']) {
                //     n.hAlign = n['halign'];
                // }

                getDataFields(cols[i + 1], n.colspan).forEach(d => {
                    if (!fields.includes(f => f.field === d.field)) {
                        fields.push(d);
                    }
                });
            } else {
                if (!fields.includes(f => f.field === n.field)) {
                    fields.push(n);
                }
            }
        });
    }
    return fields.filter(n => !n.colspan || n.colspan === 1);
}

calculationGroupColumnWidth();