//   {/* Keep existing API-based options below the 3D panel */}
//   <Box className={styles.rightColumn} sx={{ marginTop: 2 }}>
//   <Card className={styles.customizationCard}>
//     <CardContent className={styles.customizationContent}>
//       <Box className={styles.scrollableContainer}>
//         <>
// {/* ===== API-BASED OPTIONS - DIVIDER ===== */}
// <Divider className={styles.divider} sx={{ mb: 3 }}>
//  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
//    Product Customization Options
//  </Typography>
// </Divider>

// {/* ===== MATERIAL SELECTION SECTION ===== */}
//          <Box className={styles.sectionContainer}>
//            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//              <Typography variant="h6" className={styles.sectionTitle}>
//                Choose Your Material
//              </Typography>
//              {selectedTexture !== 'none' && (() => {
//                const selectedMaterial = variations?.material_types?.find((m: any) => m.id.toString() === selectedTexture);
//                const price = Number(selectedMaterial?.price);
//                return selectedMaterial?.price && price > 0 ? (
//                  <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '0.95rem', marginRight: '10px' }}>
//                    +${price.toFixed(2)}
//                  </Typography>
//                ) : null;
//              })()}
//            </Box>
          
//                                {/* Selected Material Name - Removed to show only on hover */}
          
//            <Box className={styles.materialOptionsContainer}>
//              {/* Dynamic materials from API data */}
//              {variations?.material_types && variations.material_types.length > 0 ? (
//                <>
//                  {/* None Option - Only show when materials are available */}
//                  <Tooltip title="No Material">
//                    <Box
//                      onClick={() => setSelectedTexture('none')}
//                      className={`${styles.materialOption} ${selectedTexture === 'none' ? styles.selected : ''}`}
//                    >
//                      <Box className={styles.noneOption}>
//                        <Typography variant="caption" className={styles.noneText}>
//                          None
//                        </Typography>
//                      </Box>
//                      {selectedTexture === 'none' && (
//                        <Box className={styles.selectedOverlay}>
//                          <CheckCircle sx={{ 
//                            color: 'white', 
//                            fontSize: { xs: 18, sm: 20, md: 24 } 
//                          }} />
//                        </Box>
//                      )}
//                    </Box>
//                  </Tooltip>
                 
//                  {/* Material options */}
//                  {variations.material_types.map((material: any) => (
//                    <Tooltip key={material.id} title={material.name} placement="top">
//                      <Box
//                        onClick={() => setSelectedTexture(material.id.toString())}
//                        className={`${styles.materialOption} ${selectedTexture === material.id.toString() ? styles.selected : ''}`}
//                      >
//                        {material.image_url ? (
//                          <Image
//                            src={material.image_url}
//                            alt={material.name}
//                            fill
//                            style={{ objectFit: 'cover' }}
//                          />
//                        ) : (
//                          <Box className={styles.noneOption}>
//                            <Typography variant="caption" className={styles.noneText}>
//                              {material.name}
//                            </Typography>
//                          </Box>
//                        )}
//                        {selectedTexture === material.id.toString() && (
//                          <Box className={styles.selectedOverlay}>
//                            <CheckCircle sx={{ 
//                              color: 'white', 
//                              fontSize: { xs: 18, sm: 20, md: 24 } 
//                            }} />
//                          </Box>
//                        )}
//                      </Box>
//                    </Tooltip>
//                  ))}
//                </>
//              ) : (
//                // Fallback when no variation data is available
//                <Box sx={{
//                  display: 'flex',
//                  justifyContent: 'center',
//                  alignItems: 'center',
//                  width: '100%',
//                  minHeight: '60px',
//                  padding: 2,
//                  backgroundColor: 'transparent',
//                  borderRadius: 1,
//                  border: '1px dashed #ccc'
//                }}>
//                  <Typography variant="body2" sx={{ 
//                    color: 'text.secondary',
//                    textAlign: 'center',
//                    fontWeight: 'medium'
//                  }}>
//                    No materials available
//                  </Typography>
//                </Box>
//              )}
//            </Box>
          
          
//         </Box>

//                            {/* Divider */}
//          <Divider className={styles.divider} />

//                            {/* ===== COLOR SELECTION SECTION ===== */}
//          <Box>
//            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//              <Typography variant="h6" className={styles.sectionTitle}>
//                Choose Your Color
//              </Typography>
//              {selectedColor !== 'none' && (() => {
//                const selectedColorItem = variations?.colors?.find((c: any) => c.id.toString() === selectedColor);
//                const price = Number(selectedColorItem?.price);
//                return selectedColorItem?.price && price > 0 ? (
//                  <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '0.95rem', marginRight: '10px' }}>
//                    +${price.toFixed(2)}
//                  </Typography>
//                ) : null;
//              })()}
//            </Box>
           
//             {/* Dynamic color display from variation data */}
//             <Box className={styles.colorOptionsContainer}>
//               {/* Dynamic colors from API data */}
//               {variations?.colors && variations.colors.length > 0 ? (
//                 <>
//                   {/* None Option - Only show when colors are available */}
//                   <Tooltip title="No Color">
//                     <Box
//                       onClick={() => setSelectedColor('none')}
//                       className={`${styles.colorOption} ${selectedColor === 'none' ? styles.selected : ''}`}
//                       style={{ backgroundColor: '#f5f5f5' }}
//                     >
//                       <Typography 
//                         variant="caption" 
//                         className={styles.noneColorText}
//                         style={{ color: selectedColor === 'none' ? '#d32f2f' : '#666' }}
//                       >
//                         None
//                       </Typography>
//                       {selectedColor === 'none' && (
//                         <CheckCircle sx={{
//                           color: '#d32f2f',
//                           fontSize: { xs: 12, sm: 14, md: 16 },
//                           position: 'absolute',
//                           top: '50%',
//                           left: '50%',
//                           transform: 'translate(-50%, -50%)',
//                           zIndex: 2
//                         }} />
//                       )}
//                     </Box>
//                   </Tooltip>
                  
//                   {/* Color options */}
//                   {variations.colors.map((color: any) => (
//                     <Tooltip key={color.id} title={color.name}>
//                       <Box
//                         onClick={() => setSelectedColor(color.id.toString())}
//                         className={`${styles.colorOption} ${selectedColor === color.id.toString() ? styles.selected : ''}`}
//                         style={{ backgroundColor: color.hex_code || '#ccc' }}
//                       >
//                         {selectedColor === color.id.toString() && (
//                           <CheckCircle sx={{
//                             color: 'white',
//                             fontSize: { xs: 16, sm: 17, md: 18 },
//                             position: 'absolute',
//                             top: '50%',
//                             left: '50%',
//                             transform: 'translate(-50%, -50%)',
//                             zIndex: 2
//                           }} />
//                         )}
//                       </Box>
//                     </Tooltip>
//                   ))}
//                 </>
//               ) : (
//                 // Fallback when no variation data is available
//                 <Box sx={{
//                   display: 'flex',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   width: '100%',
//                   minHeight: '60px',
//                   padding: 2,
//                   backgroundColor: 'transparent',
//                   borderRadius: 1,
//                   border: '1px dashed #ccc'
//                 }}>
//                   <Typography variant="body2" sx={{ 
//                     color: 'text.secondary',
//                     textAlign: 'center',
//                     fontWeight: 'medium'
//                   }}>
//                     No colors available
//                   </Typography>
//                 </Box>
//               )}
//             </Box>
//         </Box>

//         {/* Divider */}
//         <Divider sx={{ my: { xs: 1, sm: 1, md: 1.5 , lg: 1.5 , xl:1.5} }} />

// {/* ===== STITCHING PATTERN SECTION ===== */}
//           <Box className={styles.sectionContainer}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//               <Typography variant="h6" className={styles.sectionTitle}>
//                 Choose Your Stitching Pattern
//               </Typography>
//               {selectedStitching !== 'none' && (() => {
//                 const selectedStitchingItem = variations?.seat_stitch_patterns?.find((s: any) => s.id.toString() === selectedStitching);
//                 const price = Number(selectedStitchingItem?.price);
//                 return selectedStitchingItem?.price && price > 0 ? (
//                   <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '1.1rem' }}>
//                     +${price.toFixed(2)}
//                   </Typography>
//                 ) : null;
//               })()}
//             </Box>
           
//             <Box className={styles.stitchingOptionsContainer}>
//               {/* Dynamic stitching patterns from API data */}
//               {variations?.seat_stitch_patterns && variations.seat_stitch_patterns.length > 0 ? (
//                 <>
//                   {/* None Option - Only show when stitching patterns are available */}
//                   <Tooltip title="No Stitching Pattern">
//                     <Box
//                       onClick={() => setSelectedStitching('none')}
//                       className={`${styles.stitchingOption} ${selectedStitching === 'none' ? styles.selected : ''}`}
//                     >
//                       <Box className={styles.noneOption}>
//                         <Typography variant="caption" className={styles.noneText}>
//                           None
//                         </Typography>
//                       </Box>
//                       {selectedStitching === 'none' && (
//                         <Box className={styles.selectedOverlay}>
//                           <CheckCircle sx={{ 
//                             color: 'white', 
//                             fontSize: { xs: 18, sm: 20, md: 24 } 
//                           }} />
//                         </Box>
//                       )}
//                     </Box>
//                   </Tooltip>
                  
//                   {/* Stitching pattern options */}
//                   {variations.seat_stitch_patterns.map((stitching: any) => (
//                     <Tooltip key={stitching.id} title={stitching.name} placement="top">
//                       <Box
//                         onClick={() => setSelectedStitching(stitching.id.toString())}
//                         className={`${styles.stitchingOption} ${selectedStitching === stitching.id.toString() ? styles.selected : ''}`}
//                       >
//                         {stitching.image_url ? (
//                           <Image
//                             src={stitching.image_url}
//                             alt={stitching.name}
//                             fill
//                             style={{ objectFit: 'cover' }}
//                           />
//                         ) : (
//                           <Box className={styles.noneOption}>
//                             <Typography variant="caption" className={styles.noneText}>
//                               {stitching.name}
//                             </Typography>
//                           </Box>
//                         )}
//                         {selectedStitching === stitching.id.toString() && (
//                           <Box className={styles.selectedOverlay}>
//                             <CheckCircle sx={{ 
//                               color: 'white', 
//                               fontSize: { xs: 18, sm: 20, md: 24 } 
//                             }} />
//                           </Box>
//                         )}
//                       </Box>
//                     </Tooltip>
//                   ))}
//                 </>
//               ) : (
//                 // Fallback when no variation data is available
//                 <Box sx={{
//                   display: 'flex',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   width: '100%',
//                   minHeight: '60px',
//                   padding: 2,
//                   backgroundColor: 'transparent',
//                   borderRadius: 1,
//                   border: '1px dashed #ccc'
//                 }}>
//                   <Typography variant="body2" sx={{ 
//                     color: 'text.secondary',
//                     textAlign: 'center',
//                     fontWeight: 'medium'
//                   }}>
//                     No stitching patterns available
//                   </Typography>
//                 </Box>
//               )}
//             </Box>
//          </Box>

//                            {/* Divider */}
//          <Divider className={styles.divider} />

//                                                                      {/* ===== VEHICLE INFORMATION SECTION ===== */}
//            <Box className={styles.vehicleInfoSection}>
//              <Typography variant="h6" className={styles.sectionTitle}>
//                Vehicle Fitments
//              </Typography>
           
//              {vehicleTrimLoading ? (
//                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
//                  <Typography variant="body2" color="text.secondary">
//                    Loading vehicle Fitments...
//                  </Typography>
//                </Box>
//              ) : vehicleTrimData ? (
//                <Box className={styles.formRow}>
//                  {/* Vehicle Make - Read Only */}
//                  <Box className={styles.formField}>
//                    <Typography variant="body2" className={styles.fieldLabel}>
//                      Vehicle Make:
//                    </Typography>
//                    <FormControl className={styles.formControl}>
//                      <Select
//                        value={selectedMake}
//                        disabled
//                        displayEmpty
//                        className={styles.selectField}
//                      >
//                        <MenuItem value={selectedMake}>
//                          {vehicleTrimData.model?.make?.name || 'Unknown Make'}
//                        </MenuItem>
//                      </Select>
//                    </FormControl>
//                  </Box>

//                  {/* Vehicle Model - Read Only */}
//                  <Box className={styles.formField}>
//                    <Typography variant="body2" className={styles.fieldLabel}>
//                      Vehicle Model:
//                    </Typography>
//                    <FormControl className={styles.formControl}>
//                      <Select
//                        value={selectedModel}
//                        disabled
//                        displayEmpty
//                        className={styles.selectField}
//                      >
//                        <MenuItem value={selectedModel}>
//                          {vehicleTrimData.model?.name || 'Unknown Model'}
//                        </MenuItem>
//                      </Select>
//                    </FormControl>
//                  </Box>

//                  {/* Vehicle Trim - Read Only */}
//                  <Box className={styles.formField}>
//                    <Typography variant="body2" className={styles.fieldLabel}>
//                      Vehicle Trim:
//                    </Typography>
//                    <FormControl className={styles.formControl}>
//                      <Select
//                        value={selectedTrim}
//                        disabled
//                        displayEmpty
//                        className={styles.selectField}
//                      >
//                        <MenuItem value={selectedTrim}>
//                          {vehicleTrimData.name || 'Unknown Trim'}
//                        </MenuItem>
//                      </Select>
//                    </FormControl>
//                  </Box>
//                </Box>
//              ) : (
//               <Box sx={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 width: '100%',
//                 minHeight: '60px',
//                 padding: 2,
//                 backgroundColor: 'transparent',
//                 borderRadius: 1,
//                 border: '1px dashed #ccc'
//               }}>
//                  <Typography variant="body2" color="text.secondary">
//                    No vehicle Fitments available for this product
//                  </Typography>
//                </Box>
//              )}
//            </Box>

//                              {/* Divider */}
//            <Divider className={styles.divider} />

//  {/* ===== VARIATION SECTION ===== */}
//            <Box className={styles.variationSection}>
//              <Typography variant="h6" className={styles.sectionTitle}>
//                Variation
//              </Typography>
           
//              {/* Check if any variation options are available */}
//              {((variations?.recline_types && variations.recline_types.length > 0) || 
//                (variations?.lumbar_types && variations.lumbar_types.length > 0) || 
//                (variations?.heat_options && variations.heat_options.length > 0)) ? (
//                <Box className={styles.formRow}>
//                  {/* Recline - Only show if options available */}
//                  {variations?.recline_types && variations.recline_types.length > 0 && (
//                    <Box className={styles.formField}>
//                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                        <Typography variant="body2" className={styles.fieldLabel}>
//                          Recline:
//                          {selectedRecline && (() => {
//                            const selectedReclineItem = variations?.recline_types?.find((r: any) => r.id.toString() === selectedRecline);
//                            return selectedReclineItem?.price && parseFloat(selectedReclineItem.price.toString()) > 0 ? (
//                              <span style={{ color: '#d32f2f', fontWeight: 'bold', marginLeft: '8px' }}>
//                                +${parseFloat(selectedReclineItem.price.toString()).toFixed(2)}
//                              </span>
//                            ) : null;
//                          })()}
//                        </Typography>
//                      </Box>
//                      <FormControl className={styles.formControl}>
//                        <Select
//                          value={selectedRecline}
//                          onChange={(e) => setSelectedRecline(e.target.value)}
//                          displayEmpty
//                          className={styles.selectField}
//                        >
//                         <MenuItem value="" disabled>
//                           Recline
//                         </MenuItem>
//                         {variations.recline_types.map((recline: any) => (
//                           <MenuItem key={recline.id} value={recline.id.toString()}>
//                             {recline.name}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Box>
//                  )}

//                  {/* Lumber - Only show if options available */}
//                  {variations?.lumbar_types && variations.lumbar_types.length > 0 && (
//                    <Box className={styles.formField}>
//                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                        <Typography variant="body2" className={styles.fieldLabel}>
//                          Lumber:
//                           {selectedLumber && (() => {
//                             const selectedLumberItem = variations?.lumbar_types?.find((l: any) => l.id.toString() === selectedLumber);
//                             return selectedLumberItem?.price && parseFloat(selectedLumberItem.price.toString()) > 0 ? (
//                               <span style={{ color: '#d32f2f', fontWeight: 'bold', marginLeft: '8px' }}>
//                                 +${parseFloat(selectedLumberItem.price.toString()).toFixed(2)}
//                               </span>
//                             ) : null;
//                           })()}
//                        </Typography>
//                      </Box>
//                      <FormControl className={styles.formControl}>
//                         <Select
//                           value={selectedLumber}
//                           onChange={(e) => setSelectedLumber(e.target.value)}
//                           displayEmpty
//                           className={styles.selectField}
//                         >
//                          <MenuItem value="" disabled>
//                            Lumber
//                          </MenuItem>
//                          {variations.lumbar_types.map((lumber: any) => (
//                            <MenuItem key={lumber.id} value={lumber.id.toString()}>
//                              {lumber.name}
//                            </MenuItem>
//                          ))}
//                        </Select>
//                      </FormControl>
//                    </Box>
//                  )}

//                  {/* Heating and Cooling - Only show if options available */}
//                  {variations?.heat_options && variations.heat_options.length > 0 && (
//                    <Box className={styles.formField}>
//                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                        <Typography variant="body2" className={styles.fieldLabel}>
//                          Heating and Cooling:
//                           {selectedHeatingCooling && (() => {
//                             const selectedHeatingItem = variations?.heat_options?.find((h: any) => h.id.toString() === selectedHeatingCooling);
//                             return selectedHeatingItem?.price && parseFloat(selectedHeatingItem.price.toString()) > 0 ? (
//                               <span style={{ color: '#d32f2f', fontWeight: 'bold', marginLeft: '8px' }}>
//                                 +${parseFloat(selectedHeatingItem.price.toString()).toFixed(2)}
//                               </span>
//                             ) : null;
//                           })()}
//                        </Typography>
//                      </Box>
//                      <FormControl className={styles.formControl}>
//                         <Select
//                           value={selectedHeatingCooling}
//                           onChange={(e) => setSelectedHeatingCooling(e.target.value)}
//                           displayEmpty
//                           className={styles.selectField}
//                         >
//                          <MenuItem value="" disabled>
//                            Heating/Cooling
//                          </MenuItem>
//                          {variations.heat_options.map((heatingCooling: any) => (
//                            <MenuItem key={heatingCooling.id} value={heatingCooling.id.toString()}>
//                              {heatingCooling.name}
//                            </MenuItem>
//                          ))}
//                        </Select>
//                      </FormControl>
//                    </Box>
//                  )}
//                </Box>
//              ) : (
//               <Box sx={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 width: '100%',
//                 minHeight: '60px',
//                 padding: 2,
//                 backgroundColor: 'transparent',
//                 borderRadius: 1,
//                 border: '1px dashed #ccc'
//               }}>
//                  <Typography variant="body2" color="text.secondary">
//                    No variations available for this product
//                  </Typography>
//                </Box>
//              )}
//            </Box>

//           {/* Divider */}
//           <Divider className={styles.divider} />

//                                                                          {/* ===== SEAT SECTION ===== */}
//            <Box className={styles.seatSection}>
//              <Typography variant="h6" className={styles.sectionTitle}>
//                Seat
//              </Typography>
           
//              {/* Check if any seat options are available */}
//              {((variations?.seat_types && variations.seat_types.length > 0) || 
//                (variations?.item_types && variations.item_types.length > 0) || 
//                (variations?.seat_styles && variations.seat_styles.length > 0) || 
//                (variations?.material_types && variations.material_types.length > 0) || 
//                (variations?.arm_types && variations.arm_types.length > 0)) ? (
//                <Box className={styles.formRow}>
//                  {/* Seat Type - Only show if options available */}
//                  {variations?.seat_types && variations.seat_types.length > 0 && (
//                    <Box className={styles.formField}>
//                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                        <Typography variant="body2" className={styles.fieldLabel}>
//                          Seat Type:
//                           {selectedSeatType && (() => {
//                             const selectedSeatTypeItem = variations?.seat_types?.find((s: any) => s.id.toString() === selectedSeatType);
//                             const price = Number(selectedSeatTypeItem?.price);
//                             return selectedSeatTypeItem?.price && price > 0 ? (
//                               <span style={{ color: '#d32f2f', fontWeight: 'bold', marginLeft: '8px' }}>
//                                 +${price.toFixed(2)}
//                               </span>
//                             ) : null;
//                           })()}
//                        </Typography>
//                      </Box>
//                      <FormControl className={styles.formControl}>
//                         <Select
//                           value={selectedSeatType}
//                           onChange={(e) => setSelectedSeatType(e.target.value)}
//                           displayEmpty
//                           className={styles.selectField}
//                         >
//                          <MenuItem value="" disabled>
//                            Seat Type
//                          </MenuItem>
//                          {variations.seat_types.map((seatType: any) => (
//                            <MenuItem key={seatType.id} value={seatType.id.toString()}>
//                              {seatType.name}
//                            </MenuItem>
//                          ))}
//                        </Select>
//                      </FormControl>
//                    </Box>
//                  )}

//                  {/* Item Type - Only show if options available */}
//                  {variations?.item_types && variations.item_types.length > 0 && (
//                    <Box className={styles.formField}>
//                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                        <Typography variant="body2" className={styles.fieldLabel}>
//                          Item Type:
//                           {selectedItemType && (() => {
//                             const selectedItemTypeItem = variations?.item_types?.find((i: any) => i.id.toString() === selectedItemType);
//                             const price = Number(selectedItemTypeItem?.price);
//                             return selectedItemTypeItem?.price && price > 0 ? (
//                               <span style={{ color: '#d32f2f', fontWeight: 'bold', marginLeft: '8px' }}>
//                                 +${price.toFixed(2)}
//                               </span>
//                             ) : null;
//                           })()}
//                        </Typography>
//                      </Box>
//                      <FormControl className={styles.formControl}>
//                         <Select
//                           value={selectedItemType}
//                           onChange={(e) => setSelectedItemType(e.target.value)}
//                           displayEmpty
//                           className={styles.selectField}
//                         >
//                          <MenuItem value="" disabled>
//                             Item Type
//                          </MenuItem>
//                          {variations.item_types.map((itemType: any) => (
//                            <MenuItem key={itemType.id} value={itemType.id.toString()}>
//                              {itemType.name}
//                            </MenuItem>
//                          ))}
//                        </Select>
//                      </FormControl>
//                    </Box>
//                  )}

//                  {/* Seat Style - Only show if options available */}
//                  {variations?.seat_styles && variations.seat_styles.length > 0 && (
//                    <Box className={styles.formField}>
//                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                        <Typography variant="body2" className={styles.fieldLabel}>
//                          Seat Style:
//                           {selectedSeatStyle && (() => {
//                             const selectedSeatStyleItem = variations?.seat_styles?.find((s: any) => s.id.toString() === selectedSeatStyle);
//                             const price = Number(selectedSeatStyleItem?.price);
//                             return selectedSeatStyleItem?.price && price > 0 ? (
//                               <span style={{ color: '#d32f2f', fontWeight: 'bold', marginLeft: '8px' }}>
//                                 +${price.toFixed(2)}
//                               </span>
//                             ) : null;
//                           })()}
//                        </Typography>
//                      </Box>
//                      <FormControl className={styles.formControl}>
//                         <Select
//                           value={selectedSeatStyle}
//                           onChange={(e) => setSelectedSeatStyle(e.target.value)}
//                           displayEmpty
//                           className={styles.selectField}
//                         >
//                          <MenuItem value="" disabled>
//                            Seat Style
//                          </MenuItem>
//                          {variations.seat_styles.map((seatStyle: any) => (
//                            <MenuItem key={seatStyle.id} value={seatStyle.id.toString()}>
//                              {seatStyle.name}
//                            </MenuItem>
//                          ))}
//                        </Select>
//                      </FormControl>
//                    </Box>
//                  )}

//                  {/* Material Type - Only show if options available */}
//                  {variations?.material_types && variations.material_types.length > 0 && (
//                    <Box className={styles.formField}>
//                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                        <Typography variant="body2" className={styles.fieldLabel}>
//                          Material Type:
//                           {selectedMaterialType && (() => {
//                             const selectedMaterialTypeItem = variations?.material_types?.find((m: any) => m.id.toString() === selectedMaterialType);
//                             const price = Number(selectedMaterialTypeItem?.price);
//                             return selectedMaterialTypeItem?.price && price > 0 ? (
//                               <span style={{ color: '#d32f2f', fontWeight: 'bold', marginLeft: '8px' }}>
//                                 +${price.toFixed(2)}
//                               </span>
//                             ) : null;
//                           })()}
//                        </Typography>
//                      </Box>
//                      <FormControl className={styles.formControl}>
//                         <Select
//                           value={selectedMaterialType}
//                           onChange={(e) => setSelectedMaterialType(e.target.value)}
//                           displayEmpty
//                           className={styles.selectField}
//                         >
//                          <MenuItem value="" disabled>
//                             Material Type
//                          </MenuItem>
//                          {variations.material_types.map((materialType: any) => (
//                            <MenuItem key={materialType.id} value={materialType.id.toString()}>
//                              {materialType.name}
//                            </MenuItem>
//                          ))}
//                        </Select>
//                      </FormControl>
//                    </Box>
//                  )}

//                  {/* Included Arm - Only show if options available */}
//                  {variations?.arm_types && variations.arm_types.length > 0 && (
//                    <Box className={styles.formField}>
//                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                        <Typography variant="body2" className={styles.fieldLabel}>
//                          Included Arm:
//                           {selectedIncludedArm && (() => {
//                             const selectedIncludedArmItem = variations?.arm_types?.find((a: any) => a.id.toString() === selectedIncludedArm);
//                             const price = Number(selectedIncludedArmItem?.price);
//                             return selectedIncludedArmItem?.price && price > 0 ? (
//                               <span style={{ color: '#d32f2f', fontWeight: 'bold', marginLeft: '8px' }}>
//                                 +${price.toFixed(2)}
//                               </span>
//                             ) : null;
//                           })()}
//                        </Typography>
//                      </Box>
//                      <FormControl className={styles.formControl}>
//                         <Select
//                           value={selectedIncludedArm}
//                           onChange={(e) => setSelectedIncludedArm(e.target.value)}
//                           displayEmpty
//                           className={styles.selectField}
//                         >
//                          <MenuItem value="" disabled>
//                            Included Arm
//                          </MenuItem>
//                          {variations.arm_types.map((includedArm: any) => (
//                            <MenuItem key={includedArm.id} value={includedArm.id.toString()}>
//                              {includedArm.name}
//                            </MenuItem>
//                          ))}
//                        </Select>
//                      </FormControl>
//                    </Box>
//                  )}

//               </Box>
//              ) : (
//               <Box sx={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 width: '100%',
//                 minHeight: '60px',
//                 padding: 2,
//                 backgroundColor: 'transparent',
//                 borderRadius: 1,
//                 border: '1px dashed #ccc'
//               }}>
//                  <Typography variant="body2" color="text.secondary">
//                    No seat options available for this product
//                  </Typography>
//                </Box>
//              )}
//            </Box>

//                                {/* Divider */}
//            <Divider className={styles.finalDivider} />
//            </>
//       </Box>
//     </CardContent>
//   </Card>
  
//          {/* ===== PRICE BREAKDOWN CONTAINER - RIGHT BOTTOM SECTION ===== */}

//     {productData && selectedTexture && (
//       <Card className={styles.priceCard}>
//                         <CardContent className={styles.priceContent}>
                                                             
         
//                              {/* SIMPLIFIED PRICE LAYOUT: Only Total Price and Add to Cart */}
//           <Box className={styles.priceLayout}>
//                                <Typography variant="h4" className={styles.totalPrice}>
//              US ${totalPrice.toFixed(2)}
//            </Typography>
          
//        {/* SECOND ROW: Add to Cart button only */}
//    <Box className={styles.addToCartContainer}>
//             {/* ADD TO CART BUTTON */}
//                                    <Button
//                variant="contained"
//                size="medium"
//                startIcon={<ShoppingCart sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }} />}
//                onClick={() => {
//                   const materialName = selectedTexture === 'none' ? 'No Material' : 
//                     variations?.material_types?.find((m: any) => m.id.toString() === selectedTexture)?.name || 'Custom Material';
//                   const colorName = selectedColor === 'none' ? 'No Color' : 
//                     variations?.colors?.find((c: any) => c.id.toString() === selectedColor)?.name || 'Custom Color';
//                   const stitchingName = selectedStitching === 'none' ? 'No Stitching' : 
//                     variations?.seat_stitch_patterns?.find((s: any) => s.id.toString() === selectedStitching)?.name || 'Custom Stitching';

//                   dispatch(addItem({
//                     id: productData.id,
//                     title: `${productData.name} - ${materialName} ${colorName} ${stitchingName}`,
//                     price: `$${totalPrice}`,
//                     image: productData.primary_image?.image_url || '/placeholder-image.jpg',
//                     description: `${productData.description} with ${materialName} material, ${colorName} color, and ${stitchingName} stitching`,
//                     category: productData.category?.name || 'seat',
//                     stock: (productData as any)?.stock, // Include stock information
//                     // Persist variant selections for prefill in order wizard
//                     variants: {
//                       materialType: selectedTexture && selectedTexture !== 'none' ? selectedTexture : '',
//                       color: selectedColor && selectedColor !== 'none' ? selectedColor : '',
//                       seatStitchPattern: selectedStitching && selectedStitching !== 'none' ? selectedStitching : '',
//                       reclineType: selectedRecline || '',
//                       lumbarType: selectedLumber || '',
//                       heatOption: selectedHeatingCooling || '',
//                       seatType: selectedSeatType || '',
//                       itemType: selectedItemType || '',
//                       seatStyle: selectedSeatStyle || '',
//                       armType: selectedIncludedArm || '',
//                       // if you later add armType/lumbar in UI, wire them here too
//                     },
//                   }));

//                   // Show success snackbar
//                   setSnackbar({
//                     open: true,
//                     message: 'Successfully added to cart!',
//                     severity: 'success',
//                   });
//                }}
//                                          className={styles.addToCartButton}
//              >
//                Add to Cart
//              </Button>
//           </Box>
//       </Box>
//     </CardContent>
//   </Card>
//                )}
//  </Box>