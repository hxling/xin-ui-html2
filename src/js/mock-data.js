

export const scrollYWidth = 17;

export const enumData = [
    { label: '司令', value: '999999999' },
    { label: '军长', value: '99999999' },
    { label: '师长', value: '9999999' },
    { label: '旅长', value: '999999' },
    { label: '团长', value: '99999' },
    { label: '营长', value: '9999' },
    { label: '连长', value: '999' },
    { label: '排长', value: '99' },
    { label: '班长', value: '9' }
];


const MYNAMES = ['张三', '李四', '王五', '赵六', '周七七'];

const MYAVATARS = ['avatar-a.png', 'avatar-b.png', 'avatar-c.png', 'avatar-d.png', 'avatar-e.png',
                    'avatar-f.png', 'avatar-h.png', 'avatar-i.png', 'avatar-j.png', 'avatar-k.png', 'avatar-m.png'];

export function createData(len) {
    let arr = [];
    for (let i = 0; i < len; i++) {
        const k = i + 1;
        arr.push({
            id: k,
            name: MYNAMES[Mock.Random.integer(0, 4)],
            sex: ['男', '女'][Mock.Random.integer(0, 1)],
            birthday: Mock.Random.date(),
            marry: [true, false][Mock.Random.integer(0, 1)],
            city: Mock.Random.city(),
            addr:  Mock.Random.county(true),
            zip:   Mock.Random.zip(6),
            zipID: '',
            nianxin: Math.round(Math.random() * 10000) * 12,
            zhiwei: enumData[Mock.Random.integer(0, 8)].value,
            lang: {},
            longText: Mock.Random.cparagraph(3) + Mock.Random.cparagraph(3)+ Mock.Random.cparagraph(3),
            timer: '12:00',
            cmblookup: '001',
            cmblookup2: '001',
            avatar: MYAVATARS[Mock.Random.integer(0, 10)]
        });
    }

    return arr;
}

const defaultOpts = {
    showCheckbox: true,
    showRowNumber: true,
    fixed: true
};

export function getColumnsWidthTotal(cols, opts) {
    
    
    opts = opts || {};

    opts = Object.assign(defaultOpts, opts);

    let totalWidth = cols.reduce((r, c) => {
        r+= c.width || 100;
        return r;
    }, 0); //+ 80;

    if (opts.showCheckbox) {
        totalWidth += 40;
    }

    if (opts.showRowNumber) {
        totalWidth += 40;
    }

    return totalWidth;
}



export function renderGridRows(data, cols, opts) {

    const gvConvas =  document.querySelector('.grid-view_convas');
    if (gvConvas) {
        gvConvas.remove();
    }

    opts = Object.assign(defaultOpts, opts || {});

    const rowsDiv = document.createElement('div');
    rowsDiv.classList.add('grid-view_convas');

    const totalWidth = getColumnsWidthTotal(cols);

    data.forEach((d, i) => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('grid-view-row');
        rowDiv.style.width = `${totalWidth}px`;


        if (opts && opts.showCheckbox) {
            const chkboxDiv = document.createElement('div');
            chkboxDiv.classList.add('grid-view-cell','grid-view_row-checkbox');
            if (opts.fixed) {
                chkboxDiv.classList.add('grid-view-fixed-col');
            }
            chkboxDiv.style.width = `40px`;
            chkboxDiv.style.left = `0px`;
            chkboxDiv.innerHTML = '<input type="checkbox" />';
            rowDiv.appendChild(chkboxDiv);
        }

        if (opts && opts.showRowNumber) {
            const lineNumDiv = document.createElement('div');
            lineNumDiv.classList.add('grid-view-cell', 'grid-view_row-linenumber');
            if (opts.fixed) {
                lineNumDiv.classList.add('grid-view-fixed-col');
            }
            lineNumDiv.style.width = `40px`;
            lineNumDiv.style.left = `40px`;
            lineNumDiv.innerText = `${ i + 1}`;
            rowDiv.appendChild(lineNumDiv);
        }

        cols.forEach(col => {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('grid-view-cell');
            cellDiv.style.width = `${col.width || 100}px`;
            cellDiv.innerText = d[col.field];

            if (col.fixed == 'right') {
                cellDiv.style.right = `${col.right}px`;
                cellDiv.classList.add('grid-view-fixed-col-right');
            }

            if (col.wrap) {
                cellDiv.classList.add('wrap-content');
            }
    
            rowDiv.appendChild(cellDiv);
        });

        rowsDiv.appendChild(rowDiv);
    });
    return rowsDiv;
}
