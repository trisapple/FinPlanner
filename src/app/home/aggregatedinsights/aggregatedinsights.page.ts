import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-aggregatedinsights',
  templateUrl: './aggregatedinsights.page.html',
  styleUrls: ['./aggregatedinsights.page.scss'],
})
export class AggregatedinsightsPage implements OnInit {

  @ViewChild("doughnutCanvas") doughnutCanvas: ElementRef;

  private doughnutChart: Chart;

  title = ""
  data = []
  filtereddata = []

  labels = []
  values = []
  backgroundcolors = []
  hovercolors = []

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      var state = this.router.getCurrentNavigation().extras.state
      if (state) {
        this.title = state.title;
        this.data = state.data;
        this.filtereddata = state.data;
        this.labels = state.labels;
        this.values = state.values;
        this.backgroundcolors = state.backgroundcolors;
        this.hovercolors = state.hovercolors;
      }
    })
  }

  ionViewDidEnter() {
    // Load doughnut chart
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: "doughnut",
      data: {
        labels: this.labels,
        datasets: [
          {
            label: "Spending Insights",
            data: this.values,
            backgroundColor: this.backgroundcolors,
            hoverBackgroundColor: this.hovercolors
          }
        ]
      },
      options: {
        legend: {
          'position': 'right'
        },
        maintainAspectRatio: false,
        onClick: (evt, elements) => {
          var datasetIndex;
          var dataset;

          const { left, right, top, bottom } = this.doughnutChart.chartArea; // We have this to exclude the chart legend because it also has its own onclick otherwise we would override it
          if (evt.offsetX > left && evt.offsetX < right && evt.offsetY > top && evt.offsetY < bottom) {
            if (elements.length) {
              var index = elements[0]._index;
              datasetIndex = elements[0]._datasetIndex;

              // Reset old state
              dataset = this.doughnutChart.data.datasets[datasetIndex];
              dataset.backgroundColor = this.backgroundcolors.slice();
              dataset.hoverBackgroundColor = this.hovercolors.slice();

              dataset.backgroundColor[index] = this.hovercolors[index]; // click color
              dataset.hoverBackgroundColor[index] = this.hovercolors[index];
              if (this.title == 'Spending Insights') {
                this.filtereddata = this.data.filter(each => each["category"].includes(this.labels[index]) && Math.sign(each.amount) == -1); // Filtered expenses by category
              } 
              else if (this.title == 'Income Insights') {
                this.filtereddata = this.data.filter(each => each["category"].includes(this.labels[index]) && Math.sign(each.amount) == 1); // Filtered expenses by category
              }
            } else {
              // remove hover styles
              for (datasetIndex = 0; datasetIndex < this.doughnutChart.data.datasets.length; ++datasetIndex) {
                dataset = this.doughnutChart.data.datasets[datasetIndex];
                dataset.backgroundColor = this.backgroundcolors.slice();
                dataset.hoverBackgroundColor = this.hovercolors.slice();
              }
              if (this.title == 'Spending Insights') {
                this.filtereddata = this.data.slice().filter(each => Math.sign(each.amount) == -1); // Put back the originally filtered expenses
              }
              else if (this.title == 'Income Insights') {
                this.filtereddata = this.data.slice().filter(each => Math.sign(each.amount) == 1); // Put back the originally filtered expenses
              }
            }
            this.doughnutChart.update();
          }
        }
      }
    })
  }

}
