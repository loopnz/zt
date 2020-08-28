(function () {

    var todayData; //用户当天积分数据对象
    var userId ;
    var token = localStorage.getItem('token');



    function getKey(date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return year +""+ month + ""+day;
    }

    function gain(ruleCode, points, refId, cb,setQuestionUserId) {
        refId = refId || "";
        cb = cb || function () {}
        var uid = setQuestionUserId || userId;

        $.ajax({
            type: "POST",
            url: "/ssp/learnpoints/gain?userId=" + uid + "&ruleCode=" + ruleCode + "&points=" + points + "&refId=" + refId,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result.code === 0) {
                    cb();
                }
            }
        })

    }



    var learnpoint = {
        es: {},
        readArticleStartTime: 0, //开始阅读文章时间
        currentReadArticleStartTime: 0, //阅读时长满足条件后重新计算开始阅读文章的时间
        currentReadArticleDurationTime: 0, //当前文章阅读持续时间
        rules:[],
        stop: false, //视频是否正在播放
        getTodayData:function(){
            return todayData;
        },
        initSDK:function (refId,pageType) {

            userId = localStorage.getItem("userId")
            if (!userId) {
                throw new Error('登录后localStorage需要存在用户userId!');
            }

            //初始化时移除localStorage昨天缓存的数据
            var yesterdayKey = getKey(new Date(new Date().getTime()-24*60*60*1000));

            localStorage.removeItem(yesterdayKey);

            var key = getKey(new Date());
            todayData = localStorage.getItem(key);
            if (!todayData) {
                todayData = {
                    userId: userId,
                    article: {
                        duration: 0,
                        interval: null,
                        ids: {}
                    },
                    video: {
                        duration: 0,
                        interval: null,
                        ids: {}
                    }
                };

            } else {
                todayData = JSON.parse(todayData)
                if (todayData.userId && todayData.userId !== userId) {
                    todayData = {
                        userId: userId,
                        article: {
                            time: 0,
                            interval: null,
                            ids: {}
                        },
                        video: {
                            time: 0,
                            interval: null,
                            ids: {}
                        }
                    };
                }
            }


            this.getRules(userId,refId,pageType);

        },
        getRules:function(userId,refId,pageType){
            var self = this;
            $.ajax({
                type: "GET",
                url: "/ssp/learnpoints/findRule?userId=" + userId,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (result) {
                    if (result.code == 0) {
                        self.rules = result.result;
                        self.rules.forEach(function (item) {
                            todayData[item.ruleCode] = item;
                        })
                        self.startWork(refId,pageType);
                    }
                }
            })
        },
        on: function (eventName, cb, once) {
            if (!this.es[eventName]) {
                this.es[eventName] = [];
            }

            this.es[eventName].push({
                cb:cb,
                once:once,
            });
        },
        once: function (eventName) {
            this.on(eventName, cb, true);
        },
        emit: function (eventName) {
            var params = Array.prototype.slice.call(arguments);
            params = params.slice(1);
            var listeners = this.es[eventName] || [];
            var  l = listeners.length;

            for (var i = 0; i < l; i++) {
                var cb = listeners[i].cb;
                var once = listeners[i].once;
                cb.apply(this, params);
                if (once) {
                    listeners.splice(i, 1);
                    i--;
                    l--;
                }
            }

        },
        off: function (eventName, cb) {
            if (eventName === undefined) {
                this.es = {};
            } else {
                if (cb === undefined) {
                    delete this.es[eventName];
                } else {
                    var listeners = this.es[eventName] || [];
                    var l = listeners.length;
                    for (var i = 0; i < l; i++) {
                        if (listeners[i].cb === cb) {
                            listeners.splice(i, 1);
                            i--;
                            l--;
                        }
                    }
                }
            }
        },
        init: function (refId, pageType) {
            //如果是文章页面,初始化时需要传入pageType ,值为article,视频页面传入pageType=video;
            this.initSDK(refId,pageType);
        },
        startWork:function(refId,pageType){
            var self = this;
            var codes = [
                "answerQuestion",
                "sub",
                "fav",
                "share",
                "publish",
                "setQuestion",
                "guide",
                "visit",
                "login"
            ]

            if (refId && pageType === "acticle") {
                this.readArticle(refId);
                this.readArticleDuration(refId);
            } else if (refId && pageType === "video") {
                this.readVideo(refId)
                this.readVideoDuration(refId);
            }

            codes.forEach(function (rulecode) {
                if(rulecode === "setQuestion"){
                        self.on(rulecode, function (userId) {
                            gain(rulecode, points,null,null,userId);
                        })
                    }else{
                            self.on(rulecode, function (userId) {
                    var points = todayData[rulecode].points;
                    var limitPoints = todayData[rulecode].limitPoints;
                    var gainPoints = todayData[rulecode].gainPoints;
                    if (gainPoints + points <= limitPoints) {
                        todayData[rulecode].gainPoints = gainPoints + points
                        gain(rulecode, points,null,null,userId);
                    }
                })
                    }
            
            })
            this.emit('ready');
        },
        readVideo: function (refId) {
            this.on('readVideo', function () {
                if (!todayData['video'].ids[refId]) {
                    var points = todayData['readVideo'].points;
                    var limitPoints = todayData['readVideo'].limitPoints;
                    var gainPoints = todayData['readVideo'].gainPoints;
                    if (gainPoints + points <= limitPoints) {
                        todayData['readVideo'].gainPoints = gainPoints + points
                        gain('readVideo', points, refId, function () {
                            todayData['readVideo'].ids[refId] = true;
                        });
                    }
                }
            })
        },
        readVideoDuration: function (refId) {
            var self = this;
            self.currentReadVideoStartTime = new Date().getTime();
            self.currentReadVideoDurationTime = 0;
            var action = function () {
                var interVal = setTimeout(function () {
                    if (!self.stop) {
                        var time = new Date().getTime();
                        self.currentReadVideoDurationTime = time - currentReadVideoStartTime;
                        if (self.currentReadVideoDurationTime + todayData['video'].duration >= 2 * 60 * 1000) {
                            var points = todayData['readVideoDuration'].points;
                            var limitPoints = todayData['readVideoDuration'].limitPoints;
                            var gainPoints = todayData['readVideoDuration'].gainPoints;
                            if (gainPoints + points <= limitPoints) {
                                todayData['readVideoDuration'].gainPoints = gainPoints + points
                                gain('readVideoDuration', points, refId, function () {
                                    todayData.video.duration = 0;
                                    self.currentReadVideoStartTime = new Date().getTime();
                                    self.currentReadVideoDurationTime = 0;
                                    todayData.video.interval = action();
                                });
                            }
                        } else {
                            todayData['video'].duration = self.currentReadVideoDurationTime + todayData['video'].duration;
                            todayData.video.interval = action();
                        }
                    } else {
                        todayData.video.interval = action();
                    }
                }, 2000);
                return interVal;
            }
            todayData.article.interval = action();
            this.on('videoStop', function () {
                self.stop = true;
            })
            this.on('videoStart', function () {
                self.stop = false;
                self.currentReadVideoStartTime = new Date().getTime();
            })
        },
        readArticle: function (refId) {
            var self = this;
            this.readArticleStartTime = new Date().getTime();
            this.on('readArticle', function () {
                var time = new Date().getTime();
                if (time - self.readArticleStartTime >= 30 * 1000 && !todayData['article'].ids[refId]) {
                    var points = todayData['readArticle'].points;
                    var limitPoints = todayData['readArticle'].limitPoints;
                    var gainPoints = todayData['readArticle'].gainPoints;
                    if (gainPoints + points <= limitPoints) {
                        todayData['readArticle'].gainPoints = gainPoints + points
                        gain('readArticle', points, refId, function () {
                            todayData['article'].ids[refId] = true;
                        });
                    }
                }
            })

        },
        readArticleDuration: function (refId) {
            var self = this;
            this.currentReadArticleStartTime = new Date().getTime();
            this.currentReadArticleDurationTime = 0;
            var action = function () {
                var interVal = setTimeout(function () {
                    var time = new Date().getTime();
                    self.currentReadArticleDurationTime = time - currentReadArticleStartTime;
                    if (self.currentReadArticleDurationTime + todayData['article'].duration >= 2 * 60 * 1000) {
                        var points = todayData['readArticleDuration'].points;
                        var limitPoints = todayData['readArticleDuration'].limitPoints;
                        var gainPoints = todayData['readArticleDuration'].gainPoints;
                        if (gainPoints + points <= limitPoints) {
                            todayData['readArticleDuration'].gainPoints = gainPoints + points
                            gain('readArticleDuration', points, refId, function () {
                                todayData.article.duration = 0;
                                self.currentReadArticleStartTime = new Date().getTime();
                                self.currentReadArticleDurationTime = 0;
                                todayData.article.interval = action();
                            });
                        }
                    } else {
                        todayData['article'].duration = self.currentReadVideoDurationTime + todayData['article'].duration;
                        todayData.article.interval = action();
                        todayData.article.interval = action();
                    }
                }, 2000);
                return interVal;
            }
            todayData.article.interval = action;
        }
    }






    window.onbeforeunload = function () {
        if (todayData) {
            clearTimeout(todayData.article.interVal);
            clearTimeout(todayData.video.interVal);
            todayData.article.interVal = null;
            todayData.video.interVal = null;
            localStorage.setItem(getKey(new Date()),JSON.stringify(todayData));
        }
    }
    window.Learnpoint = window.Learnpoint || learnpoint;

})()