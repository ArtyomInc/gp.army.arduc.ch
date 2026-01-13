import ExcelJS from "exceljs";

import type { GuardPerDay } from "~/interfaces";

import { decimalToTime } from "~/lib/utils";

export interface ExportOptions {
  guardDays: GuardPerDay[];
  periodDuration: number;
  periodCount: number;
  officer: string;
  commander: string;
  logoPath: string;
  filename?: string;
}

// Mapping des couleurs Tailwind vers ARGB Excel (palette contrastée)
const colorMap: Record<string, string> = {
  "bg-emerald-200": "FFA7F3D0", // rgb(167, 243, 208) - Vert émeraude vif
  "bg-orange-200": "FFFED7AA", // rgb(254, 215, 170) - Orange militaire
  "bg-purple-200": "FFE9D5FF", // rgb(233, 213, 255) - Violet
  "bg-sky-200": "FFBAE6FD", // rgb(186, 230, 253) - Bleu ciel
  "bg-yellow-200": "FFFEF08A", // rgb(254, 240, 138) - Jaune vif
};

export function useExportXlsx() {
  async function exportToXlsx(options: ExportOptions): Promise<void> {
    try {
      // Validation des données
      if (!options.guardDays || options.guardDays.length === 0) {
        throw new Error("Aucune donnée à exporter");
      }

      // Créer le workbook
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "ArtyomInc";
      workbook.created = new Date();

      // Charger le logo (une seule fois pour toutes les feuilles)
      let imageId: number | undefined;
      try {
        const response = await fetch(options.logoPath);
        if (!response.ok) throw new Error("Logo introuvable");
        const logoBuffer = await response.arrayBuffer();
        imageId = workbook.addImage({
          buffer: logoBuffer,
          extension: "png",
        });
      } catch (err) {
        console.warn("Logo non chargé, export sans logo:", err);
      }

      // Créer une feuille par jour
      for (const day of options.guardDays) {
        const worksheet = workbook.addWorksheet(day.date, {
          pageSetup: {
            fitToHeight: 1,
            fitToPage: true,
            fitToWidth: 1,
            horizontalCentered: true,
            margins: {
              bottom: 0.5,
              footer: 0.3,
              header: 0.3,
              left: 0.5,
              right: 0.5,
              top: 0.5,
            },
            orientation: "landscape",
            paperSize: 9, // A4
            printArea: undefined, // Sera défini après
            verticalCentered: false,
          },
          views: [{ showGridLines: false }],
        });

        // Configuration des colonnes (ajustées pour A4 paysage)
        const totalWidth = 270; // Largeur disponible en A4 paysage (~27cm)
        const nameColWidth = 22;
        const periodColWidth = Math.floor(
          (totalWidth - nameColWidth) / options.periodCount,
        );

        const columns: Partial<ExcelJS.Column>[] = [
          { width: nameColWidth }, // Colonne A: Noms des paires de soldats
        ];
        for (let i = 0; i < options.periodCount; i++) {
          columns.push({ width: periodColWidth }); // Colonnes des périodes
        }
        worksheet.columns = columns;

        // Ajouter le logo en haut (ratio ~4:1 respecté)
        if (imageId !== undefined) {
          worksheet.addImage(imageId, {
            ext: { height: 80, width: 320 },
            tl: { col: 0, row: 0 },
          });
        }

        // En-têtes (lignes 7-10)
        const titleCell = worksheet.getCell("A7");
        titleCell.value = "Plan de garde";
        titleCell.font = { bold: true, size: 14 };

        const officerCell = worksheet.getCell("A8");
        officerCell.value = `Officier de garde : ${options.officer}`;

        const commanderCell = worksheet.getCell("A9");
        commanderCell.value = `Commandant de garde : ${options.commander}`;

        const dateCell = worksheet.getCell("A10");
        dateCell.value = day.date;

        // En-tête du tableau (ligne 12)
        const headerRow = 12;
        const headerNameCell = worksheet.getCell(headerRow, 1);
        headerNameCell.value = "Paire de soldat";
        headerNameCell.font = { bold: true };
        headerNameCell.alignment = {
          horizontal: "left",
          vertical: "middle",
        };
        headerNameCell.border = {
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
          top: { style: "thin" },
        };

        // En-tête des périodes horaires
        for (let i = 0; i < options.periodCount; i++) {
          const startTime = decimalToTime((i * options.periodDuration) / 60);
          const endTime = decimalToTime(
            Math.min(24, ((i + 1) * options.periodDuration) / 60),
          );
          const cell = worksheet.getCell(headerRow, i + 2);

          cell.value = `${startTime}\n-\n${endTime}`;
          cell.font = { bold: true };
          cell.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          };
          cell.border = {
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
            top: { style: "thin" },
          };

          // Hauteur de ligne pour l'en-tête
          worksheet.getRow(headerRow).height = 45;
        }

        // Données du tableau (ligne 13+)
        let currentRow = 13;

        for (const pair of day.pair) {
          // Colonne 1: Nom de la paire
          const nameCell = worksheet.getCell(currentRow, 1);
          nameCell.value = pair.name;
          nameCell.alignment = {
            horizontal: "left",
            vertical: "middle",
          };
          nameCell.border = {
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
            top: { style: "thin" },
          };

          // Colonnes 2+: Affectations avec couleurs
          for (let i = 0; i < pair.period.length; i++) {
            const period = pair.period[i];
            const cell = worksheet.getCell(currentRow, i + 2);

            cell.value = period.name;
            cell.alignment = {
              horizontal: "center",
              vertical: "middle",
            };
            cell.border = {
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
              top: { style: "thin" },
            };

            // Appliquer la couleur de fond si présente
            if (period.class && colorMap[period.class]) {
              cell.fill = {
                fgColor: { argb: colorMap[period.class] },
                pattern: "solid",
                type: "pattern",
              };
            }
          }

          // Hauteur de ligne pour les données
          worksheet.getRow(currentRow).height = 20;
          currentRow++;
        }

        // Footer (2 lignes après les données)
        const footerRow = currentRow + 2;
        const dateFooterCell = worksheet.getCell(footerRow, 1);
        dateFooterCell.value = new Date().toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          weekday: "long",
          year: "numeric",
        });

        const attributionCell = worksheet.getCell(
          footerRow,
          options.periodCount + 1,
        );
        attributionCell.value = "Tool provided by ArtyomInc (arduc.ch)";
        attributionCell.alignment = { horizontal: "right" };
        attributionCell.font = { color: { argb: "FF737373" } }; // text-neutral-500

        // Définir la zone d'impression pour inclure tout le contenu
        const lastCol = String.fromCharCode(65 + options.periodCount); // A + nombre de colonnes
        worksheet.pageSetup.printArea = `A1:${lastCol}${footerRow}`;
      }

      // Générer le buffer et télécharger le fichier
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download =
        options.filename ||
        `plan-de-garde-${new Date().toISOString().split("T")[0]}.xlsx`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error: any) {
      console.error("Export XLSX error:", error);
      throw new Error(`Échec de l'exportation: ${error.message}`);
    }
  }

  return {
    exportToXlsx,
  };
}
