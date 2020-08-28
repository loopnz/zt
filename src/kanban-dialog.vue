<template>
  <div>
    <el-dialog
      title="会议看板"
      :visible="dialogVisible"
      :fullscreen="fullScreenFlag"
      width="1080px"
      :close-on-click-modal="false"
      @close="$emit('close', false)"
    >
      <div class="kanbanDiv">
        <el-button
          type="button"
          class="confirmbtn"
          plain
          size="small"
          @click="jumpHuiYiShenQing"
          >完成</el-button
        >
        <p
          style="margin-left:10px;background: #606266;padding:0 10px;color: white;line-height: 30px;display: inline-flex"
        >
          使用说明：点击空闲区域拖动鼠标选择相应会议室及时段
          提示：视图中每小格为30分钟
        </p>
        <FullCalendar
          ref="calendar"
          :locale="locale"
          :defaultView="defaultView"
          :resources="meetingRoomList"
          resourceAreaWidth="13%"
          slotWidth="16"
          contentHeight="auto"
          :plugins="plugins"
          :header="header"
          :views="views"
          :schedulerLicenseKey="schedulerLicenseKey"
          :timeZone="timeZone"
          :scrollTime="scrollTime"
          :aspectRatio="aspectRatio"
          :editable="editable"
          :resourceLabelText="resourceLabelText"
          :resourceRender="resourceRenderFn"
          :events="eventList"
          height="parent"
          @select="select"
          @eventMouseEnter="eventMouseEnter"
          @eventResize="eventResize"
          @eventDrop="eventDrop"
          :selectable="selectable"
        />
        <!--                <el-footer>使用说明：点击空闲区域拖动鼠标选择相应会议室及时段 提示：视图中每小格为15分钟</el-footer>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "@fullcalendar/core/main.css";
import "@fullcalendar/timeline/main.css";
import "@fullcalendar/resource-timeline/main.css";
import FullCalendar from "@fullcalendar/vue";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import cnLocale from "@fullcalendar/core/locales/zh-cn";
import { Utils } from "./services";
export default {
  name: "kanban-dialog",
  components: {
    FullCalendar
  },
  props: [
    "dialogVisible",
    "meetingRoomList",
    "eventList",
    "processinstid",
    "currentStart",
    "currentEnd"
  ],
  data() {
    return {
      currentSelected: "",
      fullScreenFlag: true,
      locale: cnLocale,
      oTmpRes: [],
      selectable: true,
      // currentStart:'2019-11-07T14:11:00',
      // currentEnd:'2019-11-07T15:11:00',
      currentId: "c",
      currentTitle: "会议室C",
      schedulerLicenseKey: "GPL-My-Project-Is-Open-Source",
      plugins: [interactionPlugin, resourceTimelinePlugin],
      timeZone: "locale",
      header: {
        left: "prev,next",
        center: "title",
        right: "resourceTimelineDay,resourceTimelineWeek"
      },
      defaultView: "resourceTimelineDay",
      scrollTime: "08:00",
      aspectRatio: 1.5,
      views: {
        resourceTimelineDay: {
          buttonText: "日",
          slotDuration: "00:15",
          minTime: "08:00:00"
        },
        resourceTimelineWeek: {
          buttonText: "周",
          type: "resourceTimeline",
          slotDuration: "00:15",
          minTime: "08:00:00",
          duration: { days: 7 }
        }
      },
      editable: true,
      resourceLabelText: "会议室",

      resources: [
        { id: "a", title: "会议室A", eventColor: "rgba(102,102,102,0.5)" },
        { id: "b", title: "会议室B", eventColor: "rgba(102,102,102,0.5)" },
        { id: "c", title: "会议室C", eventColor: "rgba(102,102,102,0.5)" },
        { id: "d", title: "会议室D", eventColor: "rgba(102,102,102,0.5)" },
        { id: "e", title: "会议室E", eventColor: "rgba(102,102,102,0.5)" },
        { id: "f", title: "会议室F", eventColor: "rgba(102,102,102,0.5)" }
      ],
      events: [
        {
          resourceId: "d",
          title: "",
          start: "2019-11-05T18:11:00",
          end: "2019-11-05T19:11:00"
        },
        {
          resourceId: "c",
          title: "当前会议",
          backgroundColor: "rgba(183,182,182,0.5)",
          start: "2019-11-07T14:11:00",
          end: "2019-11-07T13:11:00"
        },
        {
          resourceId: "f",
          title: "",
          backgroundColor: "rgba(183,182,182,0.5)",
          start: "2019-11-07T07:30:00+00:00",
          end: "2019-11-07T09:30:00+00:00"
        },
        {
          resourceId: "b",
          title: "",
          backgroundColor: "rgba(183,182,182,0.5)",
          start: "2019-11-07T10:00:00+00:00",
          end: "2019-11-07T15:00:00+00:00"
        },
        {
          resourceId: "e",
          title: "",
          backgroundColor: "rgba(183,182,182,0.5)",
          start: "2019-11-07T09:00:00+00:00",
          end: "2019-11-07T14:00:00+00:00"
        }
      ]
    };
  },
  methods: {
    jumpHuiYiShenQing() {
      if (this.processinstid) {
        this.$emit("submitkanban", {
          place: this.currentTitle,
          addressid: this.currentId,
          start: this.currentStart,
          end: this.currentEnd
        });
      } else {
        if (this.oTmpRes.length == 0) {
          const h = this.$createElement;
          this.$message({
            message: h("p", null, [h("span", null, "请选择会议时间")])
          });
        } else {
          this.$emit("submitkanban", {
            place: this.oTmpRes[0].place,
            addressid: this.oTmpRes[0].resourceId,
            start: this.oTmpRes[0].start,
            end: this.oTmpRes[0].end
          });
        }
      }
    },
    select: function(info) {
      this.currentSelected = info.resource.id;
      this.$refs.calendar.getApi().rerenderResources();
      if (this.processinstid) {
        return false;
      }
      if (this.oTmpRes.length != 0) {
        this.oTmpRes.pop();
        this.eventList.pop();
      }
      let place = ``;
      this.meetingRoomList.filter(resource => {
        if (resource.id == info.resource.id) {
          place = resource.title;
        }
      });
      this.oTmpRes.push({
        resourceId: info.resource.id,
        title: "",
        start: info.startStr,
        end: info.endStr,
        place
      });
      this.eventList.push({
        resourceId: info.resource.id,
        title: "",
        start: info.startStr,
        end: info.endStr
      });
    },
    eventMouseEnter(info) {
      if (info.el.innerText == "当前会议") {
        this.editable = true;
      } else {
        this.editable = false;
        return false;
      }
    },
    eventResize(info) {
      let startDistance = info.startDelta.milliseconds;
      let endDistance = info.endDelta.milliseconds;
      if (startDistance) {
        let currentStart = new Date(this.currentStart);
        currentStart = new Date(currentStart.valueOf() + startDistance);
        currentStart = Utils.formatDateTime(currentStart);
        this.currentStart =
          currentStart.split(" ")[0] + "T" + currentStart.split(" ")[1];
      }
      if (endDistance) {
        let currentEnd = new Date(this.currentEnd);
        currentEnd = new Date(currentEnd.valueOf() + endDistance);
        currentEnd = Utils.formatDateTime(currentEnd);
        this.currentEnd =
          currentEnd.split(" ")[0] + "T" + currentEnd.split(" ")[1];
      }
    },
    eventDrop(info) {
      let distance = info.delta.milliseconds;
      let currentStart = new Date(this.currentStart);
      currentStart = new Date(currentStart.valueOf() + distance);
      currentStart = Utils.formatDateTime(currentStart);
      this.currentStart =
        currentStart.split(" ")[0] + "T" + currentStart.split(" ")[1];

      let currentEnd = new Date(this.currentEnd);
      currentEnd = new Date(currentEnd.valueOf() + distance);
      currentEnd = Utils.formatDateTime(currentEnd);
      this.currentEnd =
        currentEnd.split(" ")[0] + "T" + currentEnd.split(" ")[1];
      if (info.newResource) {
        this.currentTitle = info.newResource.title;
        this.currentId = info.newResource.id;
      }
    },
    resourceRenderFn(info) {
      if (info.resource.id === this.currentSelected) {
        info.el.style.backgroundColor = info.resource.eventBackgroundColor;
      }
      // var tooltip = new Tooltip(questionMark, {
      //   title: info.resource.title + '!!!',
      //   placement: 'top',
      //   trigger: 'hover',
      //   container: 'body'
      // });
    }
  }
  // watch:{
  //   meetingRoomList(newValue) {
  //     this.resources = newValue;
  //   },
  //   eventList(newValue){
  //     this.events=newValue;
  //   }
  // }
};
</script>

<style lang="scss" scoped>
//用什么插件必须引入相应的样式表，否则不能正常显示
.el-footer {
  background-color: rgba(108, 103, 103, 1);
  color: #ffffff;
  line-height: 50px;
  height: 50px !important;
  font-size: 14px;
}
/deep/ .fc-prev-button,
/deep/ .fc-next-button {
  color: #8b8b8b;
  background: rgba(244, 244, 244, 1);
  border: 1px solid rgba(179, 179, 179, 1);
  border-radius: 5px;
  width: 45px;
  height: 40px;
}
/deep/ .fc-icon {
  margin-top: -5px;
}
/deep/ .fc-button-active {
  background: rgba(206, 206, 206, 1) !important;
  border: 1px solid rgba(179, 179, 179, 1) !important;
}
/deep/ .fc-button-group .fc-button-primary {
  color: #8b8b8b;
  background: rgba(244, 244, 244, 1);
  border: 1px solid rgba(179, 179, 179, 1);
  border-radius: 5px;
  width: 60px;
  height: 35px;
}
/deep/ .fc-toolbar .fc-center h2 {
  font-size: 25px;
  font-family: Songti SC;
  font-weight: bold;
  color: rgba(23, 23, 23, 1);
  line-height: 18px;
}
/deep/ .fc-view-container {
  height: 400px;
  width: auto;
  overflow: scroll;
}
/deep/ .fc-rows tr {
  height: 60px;
}
/deep/ .fc-cell-content {
  height: 60px;
}
/deep/ .fc-title-wrap {
  height: 60px;
}
.confirmbtn {
  margin-top: 20px;
  margin-bottom: 10px;
  background: #ff521a;
  color: white;
}
.kanbanDiv {
  border-top: 1px solid rgba(179, 179, 179, 1);
  margin-left: 10px;
}
</style>
