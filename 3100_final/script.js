document.querySelectorAll('.s_buttons')[1].onclick = () => {
    let lists = document.querySelectorAll('.item');
    document.querySelector('#slide').appendChild(lists[0]);
}

document.addEventListener('DOMContentLoaded', function() {
    var buttons = document.querySelectorAll('.link-button');

    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            var link = button.nextElementSibling; // 获取紧接在按钮之后的超链接
            if (link && link.tagName === 'A') {
                link.click(); // 触发超链接的点击事件
            }
        });
    });
});

window.addEventListener('scroll', function() {
    const chartContainer = document.querySelector('.chartContainer');
    const video = document.querySelector('.chartContainer video');
    const spacers = document.querySelectorAll('.spacer');
    
    const rect = chartContainer.getBoundingClientRect();
    const vh = window.innerHeight;
    
    if (rect.top < 0) {
        const scrollPos = Math.abs(rect.top); // 获取滚动位置
        if (scrollPos <= vh) {
            video.style.filter = 'blur(0px)'; // 在100vh之前保持清晰
            spacers.forEach(spacer => {
                spacer.style.opacity = '1';
                spacer.style.height = '100%';
            });
        } else if (scrollPos <= 2.5 * vh) {
            const blurValue = Math.min(100, ((scrollPos - vh) / (1.5 * vh)) * 100); // 计算模糊值
            video.style.filter = `blur(${blurValue}px)`; // 在100vh到250vh之间逐渐模糊
            const opacityValue = Math.max(0, 1 - ((scrollPos - vh) / (1.5 * vh))); // 计算透明度值
            spacers.forEach(spacer => {
                spacer.style.opacity = opacityValue.toString(); // 在100vh到250vh之间逐渐消失
                spacer.style.filter = `blur(${blurValue}px)`; // 与视频同步模糊
            });
        } else {
            video.style.filter = 'blur(100px)'; // 超过250vh时最大模糊
            spacers.forEach(spacer => {
                spacer.style.opacity = '0'; // 超过250vh时spacer完全透明
                spacer.style.height = '0';
            });
        }
    } else {
        video.style.filter = 'blur(0px)'; // 在100vh之前保持清晰
        spacers.forEach(spacer => {
            spacer.style.opacity = '1';
            spacer.style.height = '100%';
            spacer.style.filter = 'blur(0px)';
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const showChartCardButton = document.getElementById('show-chart-card-button');
    const chartCard = document.getElementById('chartCard');
    const toggleButton = document.getElementById('toggleButton');

    showChartCardButton.addEventListener('click', function(event) {
        event.preventDefault();
        chartCard.style.display = 'flex';
    });

    toggleButton.addEventListener('click', function() {
        chartCard.style.display = 'none';
    });
});

const years = ['2011', '2013', '2015', '2017', '2019', '2021'];
const percentages = [16.2, 14.8, 15.5, 14.3, 15.7, 15.9];
const colors = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'];
const borderColors = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'];

// 置信区间数据
const confidenceIntervals = {
    '2011': { lower: 15.3, upper: 17.2 },
    '2013': { lower: 13.7, upper: 15.9 },
    '2015': { lower: 14.5, upper: 16.6 },
    '2017': { lower: 13.7, upper: 16.2 },
    '2019': { lower: 14.6, upper: 16.9 },
    '2021': { lower: 15.0, upper: 16.8 }
};

let isShowingIntervals = false;

// 配置数据和布局
const data = {
    labels: years,
    datasets: [{
        label: 'Percentage Over Years',
        data: percentages,
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 1
    }]
};

const config = {
    type: 'bar',
    data: data,
    options: {
        plugins: {
            title: {
                display: true,
                text:['Cyberbullying Rates Over Years',
                '(click bar to view more details)'],
                font: {
                    size: 24}
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `Year: ${context.label}, Percentage: ${context.raw}%`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Years'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Percentage'
                },
                beginAtZero: true
            }
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                if (isShowingIntervals) {
                    showAllYears();
                } else {
                    const elementIndex = elements[0].index;
                    const selectedYear = years[elementIndex];
                    const lowerLimit = confidenceIntervals[selectedYear].lower;
                    const upperLimit = confidenceIntervals[selectedYear].upper;

                    // 更新图表数据
                    myChart.data.labels = ['Lower CI', 'Upper CI'];
                    myChart.data.datasets[0].data = [lowerLimit, upperLimit];
                    myChart.data.datasets[0].backgroundColor = ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'];
                    myChart.data.datasets[0].borderColor = ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'];
                    myChart.data.datasets[0].label = `${selectedYear} Confidence Intervals`;
                    myChart.update();

                    isShowingIntervals = true;
                }
            }
        }
    }
};

// 渲染图表
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, config);

// 显示所有年份的条形图
function showAllYears() {
    myChart.data.labels = years;
    myChart.data.datasets[0].data = percentages;
    myChart.data.datasets[0].backgroundColor = colors;
    myChart.data.datasets[0].borderColor = borderColors;
    myChart.data.datasets[0].label = 'Percentage Over Years';
    myChart.update();

    isShowingIntervals = false;
}

// 切换描述显示/隐藏
function toggleDescription() {
    const description = document.querySelector('.description');
    const button = document.getElementById('toggleDescriptionButton');
    if (description.style.display === 'none' || description.style.display === '') {
        description.style.display = 'block';
        button.textContent = 'Hide Description';
    } else {
        description.style.display = 'none';
        button.textContent = 'Show Description';
    }
}

function toggleChartCard() {
    const chartCard = document.getElementById('chartCard');
    if (chartCard.style.display === 'flex') {
        chartCard.style.display = 'none';
    } else {
        chartCard.style.display = 'flex';
        showAllYears(); // 确保在显示时恢复所有年份的数据
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('chartModal');
    const closeModalButton = document.querySelector('.closeModal');
    const openModalButton = document.getElementById('show-chart-card-button');

    // 打开弹窗
    openModalButton.addEventListener('click', () => {
        console.log('Open modal button clicked'); // 调试信息
        modal.style.display = 'flex';
        document.body.classList.add('modal-active');
    });

    // 关闭弹窗
    closeModalButton.addEventListener('click', () => {
        console.log('Close modal button clicked'); // 调试信息
        modal.style.display = 'none';
        document.body.classList.remove('modal-active');
    });

    // 点击背景关闭弹窗
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            console.log('Modal background clicked'); // 调试信息
            modal.style.display = 'none';
            document.body.classList.remove('modal-active');
        }
    });
});



function adjustSlideHeight() {
    var myDivHeight = document.getElementById('myDiv').clientHeight;
    var mapDescHeight = document.getElementById('mapDescription').clientHeight;
    var totalHeight = myDivHeight + mapDescHeight;
    document.getElementById('slide').style.height = totalHeight + 'px';
}

window.onresize = function() {
    Plotly.relayout('myDiv', {
        // 更新图表的布局属性，如宽度和高度
        width: document.getElementById('myDiv').clientWidth,
        height: document.getElementById('myDiv').clientHeight
    });
};

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var ctx = document.getElementById('cyberbullyingChart').getContext('2d');
    var cyberbullyingChart;

    function initChart() {
        cyberbullyingChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['United States', 'India', 'Brazil', 'South Africa', 'Belgium', 'China', 'Japan', 'Russia'],
                datasets: [{
                    label: 'Cyberbullying Rate 2018 (%)',
                    data: [37, 26, 29, 26, 25, 17, 5, 1],
                    backgroundColor: 
                    ['rgba(75, 192, 192, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(100, 181, 246, 0.2)',
                    'rgba(220, 220, 220, 0.2)',],

                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                animation: {
                    duration: 2000,
                    easing: 'easeOutBounce',
                    onComplete: () => console.log("Animation complete")
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Intersection Observer to reset and replay animation
    var observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (cyberbullyingChart) {
                    cyberbullyingChart.destroy(); // Destroy existing chart instance if any
                }
                initChart(); // Initialize the chart to replay the animation
            } else {
                if (cyberbullyingChart) {
                    cyberbullyingChart.destroy(); // Optionally destroy chart when not visible
                }
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.getElementById('cyberbullyingChart'));
});


document.addEventListener("DOMContentLoaded", function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = "100%"; // Animate to full width when in view
            } else {
                entry.target.style.width = "0%"; // Animate to 0 width when out of view
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the element is in view
    });

    // Select all bars that need the animation
    const bars = document.querySelectorAll('.vbar');
    bars.forEach(bar => {
        observer.observe(bar);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    function createTreemap() {
        var data = [{
            type: "treemap",
            labels: [
                "Root", 
                "Cyberbullying due to Anonymity", "Spread of false and inappropriate comments", "Escalation of online violence", 
                "Proliferation of violence, pornography, and other harmful information", "Spread of negative emotions",
                "Other Security Issues due to Anonymity", "Difficulty in holding people accountable for fraud", 
                "Increased likelihood of encountering harmful individuals and suffering financial loss", 
                "Difficulty in securing information"
            ],
            parents: [
                "", 
                "Root", "Cyberbullying due to Anonymity", "Cyberbullying due to Anonymity", 
                "Cyberbullying due to Anonymity", "Cyberbullying due to Anonymity",
                "Root", "Other Security Issues due to Anonymity", 
                "Other Security Issues due to Anonymity", "Other Security Issues due to Anonymity"
            ],
            values: [
                0, 0, 66.46, 45.72, 54.17, 48.59, // Cyberbullying categories
                0, 64.17, 54.17, 61.77           // Other Security Issues categories
            ],
            textinfo: "label+value+percent parent+percent entry",
            outsidetextfont: { size: 20, color: "#377eb8" },
            marker: { line: { width: 2 } }
        }];

        var layout = {
            margin: { l: 0, r: 0, b: 0, t: 0 },
            treemapcolorway: ["#000000","#ffffff","#00cc96"],
            autosize: true
        };

        var plotArea = document.getElementById('treemap-container');
        if (plotArea) {
            Plotly.newPlot('treemap-container', data, layout);
        } else {
            console.error('No element with ID `treemap-container` found on the page.');
        }
    }

    createTreemap();
});



document.addEventListener('DOMContentLoaded', function() {
    // Setup for Anonymity Popup
    const anonymityText = document.getElementById('anonymity-text');
    const anonymityPopup = document.getElementById('anonymity-popup');
    const closeAnonymityPopup = document.getElementById('close-anonymity-popup');
    
    anonymityText.addEventListener('click', function() {
        anonymityPopup.style.display = 'flex';
    });

    closeAnonymityPopup.addEventListener('click', function() {
        anonymityPopup.style.display = 'none';
    });

    // Setup for Moderation Popup
    const moderationText = document.getElementById('moderation-text');
    const moderationPopup = document.getElementById('moderation-popup');
    const closeModerationPopup = document.getElementById('close-moderation-popup');
    
    moderationText.addEventListener('click', function() {
        moderationPopup.style.display = 'flex';
    });

    closeModerationPopup.addEventListener('click', function() {
        moderationPopup.style.display = 'none';
    });

    // Setup for Divided and Rules Popup
    const ruleText = document.getElementById('rule-text');
    const rulePopup = document.getElementById('rule-popup');
    const closeRulePopup = document.getElementById('close-rule-popup');
    
    ruleText.addEventListener('click', function() {
        rulePopup.style.display = 'flex';
    });

    closeRulePopup.addEventListener('click', function() {
        rulePopup.style.display = 'none';
    });

    // General event listener for clicking outside any popup to close it
    window.addEventListener('click', function(event) {
        if (event.target === anonymityPopup) {
            anonymityPopup.style.display = 'none';
        }
        if (event.target === moderationPopup) {
            moderationPopup.style.display = 'none';
        }
        if (event.target === rulePopup) {
            rulePopup.style.display = 'none';
        }
    });
});




Highcharts.chart('pieChartContainer', {
    chart: {
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
        },
        backgroundColor: 'transparent', // Ensures no background color
        height: 300 // Set a fixed height or make sure it's properly responsive
    },
    title: {
        text: '3D Pie Chart',
        style: {
            color: '#ffffff' // Ensure title is visible against dark backgrounds
        }
    },
    plotOptions: {
        pie: {
            innerSize: 100,
            depth: 45,
            dataLabels: {
                enabled: true,
                color: '#ffffff' // Ensure labels are visible
            },
            borderColor: '#ffffff', // Sets the border color to white
            borderWidth: 20 
        }

    },
    series: [{
        data: [
            { name: 'School Supervision', y: 35.3, color: '#C0C0C0' },
            { name: 'Parental Supervision', y: 22, color: '#FFFFFF' },
            { name: 'No Supervision', y: 42.7, color: '#FF0000' }
        ]
    }]
});



document.addEventListener('DOMContentLoaded', function() {
    var items = new vis.DataSet([
        {id: 1, content: 'Philip II of Macedon', start: '0348-01-01', end: '0336-01-01', title: 'Used divide and rule in Greece'},
        {id: 2, content: 'Aulus Gabinius in Judea', start: '-0055-01-01', end: '-0054-12-31', title: 'Divided the Jewish nation into five conventions to weaken their unity.'},
        {id: 3, content: 'Qin Shi Huang in China', start: '-0221-01-01', end:'-210-01-01',title: 'Employed "make peace with distant states to conquer nearby states" strategy to unify China.'},
        {id: 4, content: 'British Empire in India', start: '1858-01-01', end: '1907-08-15', title: 'Exploited divisions between Hindus and Muslims, notably through the partition of Bengal in 1905.'},
        {id: 5, content: 'Hernán Cortés in Mexico', start: '1519-01-01', end:'1547',title: 'Allied with the Tlaxcalans to defeat the Aztecs.'},
        {id: 6, content: 'British Rule in Cyprus', start: '1878-01-01', end: '1960-01-01', title: 'Created divisions between Greek Cypriots and Turkish Cypriots.'},
        {id: 7, content: 'British Plantations in Ireland', start: '1609-01-01', end:'1699-01-01', title: 'Settled Scottish Presbyterians in Ulster, creating conflict with Catholics.'},
        {id: 8, content: 'Norman Invasion of Ireland',start: '1169-01-01', end:'1336-01-01',title: 'Exploited disunity among Irish nobles to conquer Ireland.'},
        {id: 9, content: 'Post-WWII Division of Germany', start: '1945-01-01', end:'1939-01-01',title: 'Divided Germany and Berlin into four occupational zones.'},
        {id: 10, content: 'Colonial Africa and Asia', start: '1880-01-01', end: '1960-01-01', title: 'Exploited ethnic and linguistic divisions to maintain control.'},
        {id: 11, content: 'Modern Middle East', start: '2000-01-01', end:'2024-05-31',title: 'Alleged to have escalated Sunni-Shia conflicts to weaken regional alliances.'}

    ]);

    var container = document.getElementById('visualization');
    var options = {
        start: '-0300-01-01',
        end: '2030-01-01',
        min: '-0230-01-01',  
        max: '2030-01-01', 
        width: '80%',
        height: '600px',
        stack: false,
        showMajorLabels: true,
        showCurrentTime: false,
        zoomMin: 1000000000,
        horizontalScroll: true,
        verticalScroll: true,
        zoomable: true,
        type: 'background',
        orientation: 'top',
        groupOrder: 'content',
        template: function (item, element, data) {
            return `<div title='${item.title}' style="color: #1c1c1c; background-color: ${item.color || '#ffffff'}; border-radius: 5px; padding: 5px; border: 2px solid #333;">
                        <strong>${item.content}</strong>
                        <p>${item.title}</p>
                    </div>`;
        },
        format: {
            minorLabels: {
                millisecond: 'SSS',
                second: 's',
                minute: 'HH:mm',
                hour: 'HH:mm',
                weekday: 'ddd D',
                day: 'D',
                month: 'MMM',
                year: 'YYYY'
            },
            majorLabels: {
                millisecond: 'HH:mm',
                second: 'D MMMM HH',
                minute: 'ddd D MMMM',
                hour: 'ddd D MMMM',
                weekday: 'MMMM YYYY',
                day: 'MMMM YYYY',
                month: 'YYYY',
                year: ''
            }
        }
    };

    var timeline = new vis.Timeline(container, items, options);
    var autoplayInterval;
    var customStartTime = new Date('-0210-01-01');

    function startAutoplay() {
        var currentTime = customStartTime;
        var endTime = new Date(options.end);
        var timeStep = (endTime.getTime() - currentTime.getTime()) / (30 * 1000 / 50); // Calculate time step for animation

        autoplayInterval = setInterval(function() {
            currentTime = new Date(currentTime.getTime() + timeStep);
            timeline.setWindow(currentTime, new Date(currentTime.getTime() + timeStep * 10));
            if (currentTime >= endTime) {
                clearInterval(autoplayInterval); // Stop when end time is reached
            }
        }, 50);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval); // Clear the interval to stop autoplay
    }

    // Event listeners for the play and stop buttons
    document.getElementById('playButton').addEventListener('click', startAutoplay);
    document.getElementById('stopButton').addEventListener('click', stopAutoplay);
});


document.addEventListener('DOMContentLoaded', function() {
    var wingImage = document.getElementById('wingImage');

    function handleScroll() {
        var imagePosition = wingImage.getBoundingClientRect().top;
        var screenPosition = window.innerHeight;

        // Add 'visible' class when the image enters the viewport
        if (imagePosition < screenPosition) {
            wingImage.classList.add('visible');
        } else {
            wingImage.classList.remove('visible'); // Optional: remove class when out of view
        }
    }

    window.addEventListener('scroll', handleScroll);
});


function flipCard(cardElement) {
    let cardInner = cardElement.querySelector('.card-inner');
    cardInner.classList.toggle('is-flipped');
}

document.querySelector('.cards-container').addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1)';
});

document.querySelector('.cards-container').addEventListener('mouseleave', function() {
    this.style.transform = 'scale(0.5)';
});


