const fs = require('fs');
const path = require('path');

// Script to process the large GEOJSON file and create a smaller, optimized version
const processGeoJSON = () => {
  try {
    const inputPath = path.join(__dirname, '../assets/data/Recycling Bins.geojson');
    const outputPath = path.join(__dirname, '../assets/data/processed-bins.json');
    
    console.log('Reading GEOJSON file...');
    const rawData = fs.readFileSync(inputPath, 'utf8');
    const geojsonData = JSON.parse(rawData);
    
    console.log(`Processing ${geojsonData.features.length} features...`);
    
    // Process and optimize the data
    const processedBins = geojsonData.features.map((feature, index) => {
      const props = feature.properties;
      const coords = feature.geometry.coordinates;
      
      // Extract only essential information
      const blockNumber = props.ADDRESSBLOCKHOUSENUMBER || '';
      const streetName = props.ADDRESSSTREETNAME || '';
      const buildingName = props.ADDRESSBUILDINGNAME || '';
      const postalCode = props.ADDRESSPOSTALCODE || '';
      
      // Create a readable address
      let address = '';
      if (blockNumber && streetName) {
        address = `${blockNumber} ${streetName}`;
      } else if (streetName) {
        address = streetName;
      } else if (buildingName) {
        address = buildingName;
      }
      
      // Create a meaningful name
      let name = `Recycling Bin ${index + 1}`;
      if (buildingName) {
        name = `${buildingName} Recycling Bin`;
      } else if (address) {
        name = `${address} Recycling Bin`;
      }
      
      return {
        id: props.Name || `bin-${index}`,
        name,
        address: address.trim(),
        postalCode,
        buildingName: buildingName || undefined,
        location: {
          latitude: coords[1], // GEOJSON uses [longitude, latitude]
          longitude: coords[0],
        },
        description: 'Mixed recycling bin for paper, plastics, glass, and metals',
        type: 'mixed',
        hyperlink: props.HYPERLINK || undefined,
      };
    });
    
    // Write processed data
    fs.writeFileSync(outputPath, JSON.stringify(processedBins, null, 2));
    
    console.log(`✅ Processed ${processedBins.length} bins`);
    console.log(`📁 Output saved to: ${outputPath}`);
    console.log(`📊 Original size: ${(rawData.length / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📊 Processed size: ${(JSON.stringify(processedBins).length / 1024 / 1024).toFixed(2)} MB`);
    
  } catch (error) {
    console.error('Error processing GEOJSON:', error);
  }
};

// Run the processing
processGeoJSON();
