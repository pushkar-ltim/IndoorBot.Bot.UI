import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import L from 'leaflet';


interface Point {
  id: string;
  x: number;
  y: number;
  name?: string;
}

interface Edge {
  point1Id: string;
  point2Id: string;
  weight: number;
}

interface MapData {
  points: Point[];
  edges: Edge[];
}


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [HttpClientModule, FormsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private map: L.Map | undefined; 
  private mapData: MapData | undefined;
  startId: string = '';
  endId: string = '';
  pathPolyline: L.Polyline | null = null;


  constructor(private http: HttpClient) {}

  ngOnInit(): void {


      L.Icon.Default.imagePath = 'assets/'; // Or just 'assets/' if directly in assets
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'marker-icon-2x.png', // High-res
        iconUrl: 'marker-icon.png',
        shadowUrl: 'marker-shadow.png',

      });

      this.http.get<MapData>('https://localhost:44316/api/MapData/GetMapData?venueId=zoo').subscribe(data => {
        this.mapData = data;
        this.initMap(); // Initialize after data is loaded AND icon paths are set
      });


  }

  ngAfterViewInit(): void {
      
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove(); 
    }
  }

    private initMap(): void {
    if (!this.mapData) return; 

    console.log("Map Data:", this.mapData); // Log the entire map data


    this.map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: -2,
    });

       // --- Image Overlay ---
       const imageUrl = 'assets/zoo_map.jpg'; // Path to your image
       const imageBounds: L.LatLngBoundsExpression = [
           [0, 0],         // Top-left corner (in your map coordinates)
           [180, 180]      // Bottom-right corner (in your map coordinates)
                            //  **VERY IMPORTANT: These MUST match your image and MapData!**
       ];
   
       L.imageOverlay(imageUrl, imageBounds).addTo(this.map);
   
   
      
       this.map.fitBounds(imageBounds);

    const bounds: L.LatLngBoundsExpression = [
      [0, 0],         
      [200, 200]      
    ];
    this.map.fitBounds(bounds);

    // Add markers
    this.mapData.points.forEach(point => {
      L.marker([point.y, point.x]).addTo(this.map!) //Note the !
        .bindPopup(point.name || point.id);
    });

    // Add edges
    this.mapData.edges.forEach(edge => {
      const point1 = this.mapData!.points.find(p => p.id === edge.point1Id);
      const point2 = this.mapData!.points.find(p => p.id === edge.point2Id);
      if (point1 && point2) {
        L.polyline([[point1.y, point1.x], [point2.y, point2.x]], { color: 'blue' }).addTo(this.map!); //Note the !
      }
    });
  }

  findPath() {
    if (!this.startId || !this.endId || !this.map) return; // More robust checks

    this.http.get<Point[]>(`https://localhost:44316/api/MapData/path?startId=${this.startId}&endId=${this.endId}`)
      .subscribe(path => {
        if (this.pathPolyline) {
          this.map!.removeLayer(this.pathPolyline); // Use map! to assert non-null
        }

        const pathLatLngs = path.map(point => new L.LatLng(point.y, point.x));
        this.pathPolyline = L.polyline(pathLatLngs, { color: 'red' }).addTo(this.map!); // Use map!
      });
  }
}
